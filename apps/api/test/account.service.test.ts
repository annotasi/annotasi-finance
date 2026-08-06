import { randomUUID } from "node:crypto";

import { fc, test as fcTest } from "@fast-check/vitest";
import {
  AccountStoreError,
  type AccountFailureCode,
  type AccountLifecycleStatus,
  type AccountRecord,
  type AccountType,
  type CreateAccountInput,
  type DeleteEligibilityResult,
  type SessionStoreConnection,
} from "@annotasi/database/runtime";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";

import { AccountService } from "../src/account/account.service.js";

const SUBJECT = "subject";

/** In-memory double reproducing AccountStore's exact version/lifecycle semantics. */
class FakeAccountStore {
  private accounts = new Map<string, AccountRecord>();

  public list(): Promise<AccountRecord[]> {
    return Promise.resolve([...this.accounts.values()]);
  }

  public create(
    _subject: string,
    input: CreateAccountInput,
  ): Promise<AccountRecord> {
    const id = randomUUID();
    const record: AccountRecord = {
      id,
      workspaceId: "workspace-1",
      name: input.name,
      type: input.type,
      openingBalance: input.openingBalance,
      openingBalanceEffectiveDate: input.openingBalanceEffectiveDate,
      totalBalance: input.openingBalance,
      unallocatedBalance: input.openingBalance,
      lifecycleStatus: "active",
      isStarter: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: null,
      version: 1n,
    };
    this.accounts.set(id, record);
    return Promise.resolve(record);
  }

  private require(id: string): AccountRecord {
    const record = this.accounts.get(id);
    if (record === undefined) throw new AccountStoreError("ACCOUNT_NOT_FOUND");
    return record;
  }

  private checkVersion(record: AccountRecord, expected: bigint): void {
    if (record.version !== expected) {
      throw new AccountStoreError("ACCOUNT_CONFLICT");
    }
  }

  public rename(
    _subject: string,
    id: string,
    name: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    const record = this.require(id);
    this.checkVersion(record, expectedVersion);
    const updated = { ...record, name, version: record.version + 1n };
    this.accounts.set(id, updated);
    return Promise.resolve(updated);
  }

  public archive(
    _subject: string,
    id: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    const record = this.require(id);
    this.checkVersion(record, expectedVersion);
    if (record.lifecycleStatus !== "active") {
      throw new AccountStoreError("ACCOUNT_NOT_ACTIVE");
    }
    if (record.totalBalance !== 0n) {
      throw new AccountStoreError("ACCOUNT_ARCHIVE_BALANCE_NON_ZERO");
    }
    const updated: AccountRecord = {
      ...record,
      lifecycleStatus: "archived" as AccountLifecycleStatus,
      archivedAt: new Date(),
      version: record.version + 1n,
    };
    this.accounts.set(id, updated);
    return Promise.resolve(updated);
  }

  public restore(
    _subject: string,
    id: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    const record = this.require(id);
    this.checkVersion(record, expectedVersion);
    if (record.lifecycleStatus !== "archived") {
      throw new AccountStoreError("ACCOUNT_NOT_ARCHIVED");
    }
    const updated: AccountRecord = {
      ...record,
      lifecycleStatus: "active" as AccountLifecycleStatus,
      archivedAt: null,
      version: record.version + 1n,
    };
    this.accounts.set(id, updated);
    return Promise.resolve(updated);
  }

  /**
   * Only test-setup surface: simulates the one real Account-level dependency
   * that exists in the current schema (an onboarding_idempotency row),
   * which in the real system is created exclusively for the onboarding-
   * created starter Account. `isStarter` is the fake's proxy for that fact.
   */
  public seedStarterAccount(input: CreateAccountInput): AccountRecord {
    const id = randomUUID();
    const record: AccountRecord = {
      id,
      workspaceId: "workspace-1",
      name: input.name,
      type: input.type,
      openingBalance: input.openingBalance,
      openingBalanceEffectiveDate: input.openingBalanceEffectiveDate,
      totalBalance: input.openingBalance,
      unallocatedBalance: input.openingBalance,
      lifecycleStatus: "active",
      isStarter: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: null,
      version: 1n,
    };
    this.accounts.set(id, record);
    return record;
  }

  public evaluateDeleteEligibility(
    _subject: string,
    id: string,
  ): Promise<DeleteEligibilityResult> {
    const record = this.require(id);
    const openingBalanceZero = record.openingBalance === 0n;
    const hasOtherDependency = record.isStarter;
    const reasonCodes: DeleteEligibilityResult["reasonCodes"][number][] = [];
    if (!openingBalanceZero) reasonCodes.push("OPENING_BALANCE_NOT_ZERO");
    if (hasOtherDependency) reasonCodes.push("DEPENDENCY_EXISTS");
    return Promise.resolve({
      accountId: id,
      eligible: reasonCodes.length === 0,
      reasonCodes,
      facts: {
        openingBalanceZero,
        hasFinancialEventHistory: false,
        hasOtherDependency,
      },
    });
  }
}

/** Generates only Account names that satisfy accountNameSchema: no control
 * characters, non-empty after trim, at most 100 characters. */
const accountNameArbitrary = fc
  .array(
    fc.constantFrom(
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ".split(
        "",
      ),
    ),
    { minLength: 1, maxLength: 40 },
  )
  .map((chars) => chars.join(""))
  .filter((value) => value.trim().length > 0)
  .map((value) => value.trim());

type LifecycleAction =
  | { kind: "rename"; name: string; stale: boolean }
  | { kind: "archive"; stale: boolean }
  | { kind: "restore"; stale: boolean }
  | { kind: "eligibility" };

const lifecycleActionArbitrary: fc.Arbitrary<LifecycleAction> = fc.oneof(
  fc.record({
    kind: fc.constant("rename" as const),
    name: accountNameArbitrary,
    stale: fc.boolean(),
  }),
  fc.record({ kind: fc.constant("archive" as const), stale: fc.boolean() }),
  fc.record({ kind: fc.constant("restore" as const), stale: fc.boolean() }),
  fc.record({ kind: fc.constant("eligibility" as const) }),
);

function validCreateBody(openingBalance = "0") {
  return {
    name: "Tunai",
    type: "cash" as AccountType,
    openingBalance,
    openingBalanceEffectiveDate: "2026-08-03",
  };
}

describe("AccountService error mapping", () => {
  let store: FakeAccountStore;
  let service: AccountService;

  beforeEach(() => {
    store = new FakeAccountStore();
    service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
  });

  it("rejects a malformed create request", async () => {
    await expect(
      service.create(SUBJECT, { nope: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a create request with an out-of-range or impossible date", async () => {
    await expect(
      service.create(SUBJECT, {
        ...validCreateBody(),
        openingBalanceEffectiveDate: "2026-02-30",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a malformed rename request", async () => {
    const created = await service.create(SUBJECT, validCreateBody());
    await expect(
      service.rename(SUBJECT, created.account.id, { name: "" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  const malformedIds = [
    "",
    "not-a-uuid",
    "11111111-1111-4111-8111",
    "1 OR 1=1",
  ];

  it.each(malformedIds)(
    "rejects a malformed Account ID %j before reaching the store for rename",
    async (id) => {
      await expect(
        service.rename(SUBJECT, id, {
          name: "Tunai",
          expectedVersion: "1",
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each(malformedIds)(
    "rejects a malformed Account ID %j before reaching the store for archive",
    async (id) => {
      await expect(
        service.archive(SUBJECT, id, { expectedVersion: "1" }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each(malformedIds)(
    "rejects a malformed Account ID %j before reaching the store for restore",
    async (id) => {
      await expect(
        service.restore(SUBJECT, id, { expectedVersion: "1" }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each(malformedIds)(
    "rejects a malformed Account ID %j before reaching the store for delete-eligibility evaluation",
    async (id) => {
      await expect(
        service.evaluateDeleteEligibility(SUBJECT, id),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  const malformedVersions = [
    "0",
    "01",
    "1.5",
    "1e3",
    "9223372036854775808",
    "1".repeat(50),
  ];

  async function expectRequestInvalid(
    operation: () => Promise<unknown>,
  ): Promise<void> {
    try {
      await operation();
      expect.unreachable("expected a BadRequestException");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        code: "ACCOUNT_REQUEST_INVALID",
      });
    }
  }

  it.each(malformedVersions)(
    "rejects a malformed expectedVersion %j on rename with ACCOUNT_REQUEST_INVALID, not ACCOUNT_NAME_INVALID, and leaves state unchanged",
    async (expectedVersion) => {
      const created = await service.create(SUBJECT, validCreateBody());
      await expectRequestInvalid(() =>
        service.rename(SUBJECT, created.account.id, {
          name: "Tunai baru",
          expectedVersion,
        }),
      );
      const list = await service.list(SUBJECT);
      expect(list.accounts[0]).toEqual(created.account);
    },
  );

  it.each(malformedVersions)(
    "rejects a malformed expectedVersion %j on archive with ACCOUNT_REQUEST_INVALID and leaves state unchanged",
    async (expectedVersion) => {
      const created = await service.create(SUBJECT, validCreateBody());
      await expectRequestInvalid(() =>
        service.archive(SUBJECT, created.account.id, { expectedVersion }),
      );
      const list = await service.list(SUBJECT);
      expect(list.accounts[0]).toEqual(created.account);
    },
  );

  it.each(malformedVersions)(
    "rejects a malformed expectedVersion %j on restore with ACCOUNT_REQUEST_INVALID and leaves state unchanged",
    async (expectedVersion) => {
      const created = await service.create(SUBJECT, validCreateBody());
      const archived = await service.archive(SUBJECT, created.account.id, {
        expectedVersion: created.account.version,
      });
      await expectRequestInvalid(() =>
        service.restore(SUBJECT, archived.account.id, { expectedVersion }),
      );
      const list = await service.list(SUBJECT);
      expect(list.accounts[0]).toEqual(archived.account);
    },
  );

  it("classifies extra immutable/authority fields on rename as ACCOUNT_REQUEST_INVALID, not ACCOUNT_NAME_INVALID", async () => {
    const created = await service.create(SUBJECT, validCreateBody());
    await expectRequestInvalid(() =>
      service.rename(SUBJECT, created.account.id, {
        name: "Tunai baru",
        expectedVersion: "1",
        workspaceId: "attacker-workspace",
      }),
    );
  });

  it("still classifies a pure invalid name as ACCOUNT_NAME_INVALID", async () => {
    const created = await service.create(SUBJECT, validCreateBody());
    try {
      await service.rename(SUBJECT, created.account.id, {
        name: "",
        expectedVersion: "1",
      });
      expect.unreachable("expected a BadRequestException");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        code: "ACCOUNT_NAME_INVALID",
      });
    }
  });

  const mapping: readonly [AccountFailureCode, unknown][] = [
    ["ACCOUNT_SCOPE_REJECTED", ForbiddenException],
    ["ACCOUNT_NOT_FOUND", NotFoundException],
    ["ACCOUNT_NOT_ACTIVE", ConflictException],
    ["ACCOUNT_NOT_ARCHIVED", ConflictException],
    ["ACCOUNT_ARCHIVE_BALANCE_NON_ZERO", ConflictException],
    ["ACCOUNT_CONFLICT", ConflictException],
  ];

  it.each(mapping)("maps %s to a safe HTTP exception", async (code) => {
    const failing = {
      list: () => Promise.reject(new AccountStoreError(code)),
    };
    const failingService = new AccountService({
      account: failing,
    } as unknown as SessionStoreConnection);
    const expected = mapping.find(([c]) => c === code)?.[1];
    await expect(failingService.list(SUBJECT)).rejects.toBeInstanceOf(expected);
  });
});

describe("Account lifecycle invariant properties", () => {
  fcTest.prop([
    fc.bigInt({ min: 0n, max: 9_223_372_036_854_775_807n }),
    fc.constantFrom<AccountType>("cash", "bank_account", "e_wallet", "other"),
  ])(
    "INV-ACC-01/02/03: creation establishes Total = Unallocated = Opening >= 0, plus zero-allocation equation",
    async (openingBalance, type) => {
      const store = new FakeAccountStore();
      const service = new AccountService({
        account: store,
      } as unknown as SessionStoreConnection);
      const { account } = await service.create(SUBJECT, {
        name: "Tunai",
        type,
        openingBalance: openingBalance.toString(),
        openingBalanceEffectiveDate: "2026-08-03",
      });
      expect(BigInt(account.totalBalance)).toBeGreaterThanOrEqual(0n);
      expect(BigInt(account.unallocatedBalance)).toBeGreaterThanOrEqual(0n);
      expect(account.totalBalance).toBe(openingBalance.toString());
      expect(account.unallocatedBalance).toBe(openingBalance.toString());
      expect(BigInt(account.totalBalance)).toBe(
        BigInt(account.unallocatedBalance) + 0n,
      );
    },
  );

  fcTest.prop([fc.string({ minLength: 1, maxLength: 50 })])(
    "rename preserves identity and every financial/date/type fact",
    async (newName) => {
      const store = new FakeAccountStore();
      const service = new AccountService({
        account: store,
      } as unknown as SessionStoreConnection);
      const created = await service.create(SUBJECT, validCreateBody("5000"));
      const escaped = newName.replaceAll(/[ -]/gu, "a") || "a";
      const renamed = await service.rename(SUBJECT, created.account.id, {
        name: escaped,
        expectedVersion: created.account.version,
      });
      expect(renamed.account.id).toBe(created.account.id);
      expect(renamed.account.type).toBe(created.account.type);
      expect(renamed.account.openingBalance).toBe(
        created.account.openingBalance,
      );
      expect(renamed.account.openingBalanceEffectiveDate).toBe(
        created.account.openingBalanceEffectiveDate,
      );
      expect(renamed.account.totalBalance).toBe(created.account.totalBalance);
      expect(renamed.account.unallocatedBalance).toBe(
        created.account.unallocatedBalance,
      );
      expect(renamed.account.lifecycleStatus).toBe("active");
    },
  );

  it("duplicate Account names are accepted", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const first = await service.create(SUBJECT, validCreateBody());
    const second = await service.create(SUBJECT, validCreateBody());
    expect(first.account.name).toBe(second.account.name);
    expect(first.account.id).not.toBe(second.account.id);
  });

  it("a zero-total Account archives, preserving identity and financial facts", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const created = await service.create(SUBJECT, validCreateBody("0"));
    const archived = await service.archive(SUBJECT, created.account.id, {
      expectedVersion: created.account.version,
    });
    expect(archived.account.lifecycleStatus).toBe("archived");
    expect(archived.account.id).toBe(created.account.id);
    expect(archived.account.totalBalance).toBe(created.account.totalBalance);
    expect(archived.account.openingBalance).toBe(
      created.account.openingBalance,
    );
  });

  it("a non-zero Account cannot archive, and the rejection preserves the Active state", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const created = await service.create(SUBJECT, validCreateBody("5000"));
    await expect(
      service.archive(SUBJECT, created.account.id, {
        expectedVersion: created.account.version,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    const list = await service.list(SUBJECT);
    expect(list.accounts[0]?.lifecycleStatus).toBe("active");
    expect(list.accounts[0]?.version).toBe(created.account.version);
  });

  it("restore preserves identity and every financial/date/type fact", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const created = await service.create(SUBJECT, validCreateBody("0"));
    const archived = await service.archive(SUBJECT, created.account.id, {
      expectedVersion: created.account.version,
    });
    const restored = await service.restore(SUBJECT, created.account.id, {
      expectedVersion: archived.account.version,
    });
    expect(restored.account.lifecycleStatus).toBe("active");
    expect(restored.account.id).toBe(created.account.id);
    expect(restored.account.openingBalance).toBe(
      created.account.openingBalance,
    );
    expect(restored.account.totalBalance).toBe(created.account.totalBalance);
  });

  it("repeated invalid lifecycle operations (stale version) preserve prior confirmed state", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const created = await service.create(SUBJECT, validCreateBody("0"));
    const staleVersion = created.account.version;
    await service.rename(SUBJECT, created.account.id, {
      name: "Renamed once",
      expectedVersion: staleVersion,
    });
    // Retry with the now-stale version twice; both must be rejected and
    // leave the confirmed name from the first accepted rename untouched.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await expect(
        service.rename(SUBJECT, created.account.id, {
          name: "Should not apply",
          expectedVersion: staleVersion,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    }
    const list = await service.list(SUBJECT);
    expect(list.accounts[0]?.name).toBe("Renamed once");
  });

  it("delete eligibility evaluation never mutates Account state", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const created = await service.create(SUBJECT, validCreateBody("5000"));
    await service.evaluateDeleteEligibility(SUBJECT, created.account.id);
    await service.evaluateDeleteEligibility(SUBJECT, created.account.id);
    const list = await service.list(SUBJECT);
    expect(list.accounts[0]).toEqual(created.account);
  });

  fcTest.prop([
    fc.bigInt({ min: 0n, max: 9_223_372_036_854_775_807n }),
    fc.constantFrom<AccountType>("cash", "bank_account", "e_wallet", "other"),
    accountNameArbitrary,
    fc.array(lifecycleActionArbitrary, { maxLength: 15 }),
  ])(
    "generated lifecycle/action sequences (rename, archive, restore, eligibility, stale-version) preserve every invariant and identity fact at each step",
    async (openingBalance, type, initialName, actions) => {
      const store = new FakeAccountStore();
      const service = new AccountService({
        account: store,
      } as unknown as SessionStoreConnection);
      const created = await service.create(SUBJECT, {
        name: initialName,
        type,
        openingBalance: openingBalance.toString(),
        openingBalanceEffectiveDate: "2026-08-03",
      });

      function assertInvariants(
        account: typeof created.account,
        prior: typeof created.account,
      ): void {
        expect(BigInt(account.totalBalance)).toBeGreaterThanOrEqual(0n);
        expect(BigInt(account.unallocatedBalance)).toBeGreaterThanOrEqual(0n);
        expect(BigInt(account.totalBalance)).toBe(
          BigInt(account.unallocatedBalance) + 0n,
        );
        expect(account.id).toBe(prior.id);
        expect(account.type).toBe(prior.type);
        expect(account.openingBalance).toBe(prior.openingBalance);
        expect(account.openingBalanceEffectiveDate).toBe(
          prior.openingBalanceEffectiveDate,
        );
      }

      let confirmed = created.account;

      async function assertStatePreserved(): Promise<void> {
        const list = await service.list(SUBJECT);
        expect(list.accounts[0]).toEqual(confirmed);
        assertInvariants(confirmed, confirmed);
      }

      for (const action of actions) {
        if (action.kind === "eligibility") {
          const before = await service.list(SUBJECT);
          const result = await service.evaluateDeleteEligibility(
            SUBJECT,
            confirmed.id,
          );
          const after = await service.list(SUBJECT);
          expect(after.accounts).toEqual(before.accounts);
          expect(result.eligible).toBe(openingBalance === 0n);
          await assertStatePreserved();
          continue;
        }

        const currentVersion = BigInt(confirmed.version);
        const usedVersion = (
          action.stale ? currentVersion + 999n : currentVersion
        ).toString();

        if (action.kind === "rename") {
          if (action.stale) {
            await expect(
              service.rename(SUBJECT, confirmed.id, {
                name: action.name,
                expectedVersion: usedVersion,
              }),
            ).rejects.toBeInstanceOf(ConflictException);
            await assertStatePreserved();
            continue;
          }
          const renamed = await service.rename(SUBJECT, confirmed.id, {
            name: action.name,
            expectedVersion: usedVersion,
          });
          expect(renamed.account.name).toBe(action.name);
          assertInvariants(renamed.account, confirmed);
          confirmed = renamed.account;
          continue;
        }

        if (action.kind === "archive") {
          const canArchive =
            !action.stale &&
            confirmed.lifecycleStatus === "active" &&
            BigInt(confirmed.totalBalance) === 0n;
          if (!canArchive) {
            await expect(
              service.archive(SUBJECT, confirmed.id, {
                expectedVersion: usedVersion,
              }),
            ).rejects.toBeInstanceOf(ConflictException);
            await assertStatePreserved();
            continue;
          }
          const archived = await service.archive(SUBJECT, confirmed.id, {
            expectedVersion: usedVersion,
          });
          expect(archived.account.lifecycleStatus).toBe("archived");
          assertInvariants(archived.account, confirmed);
          confirmed = archived.account;
          continue;
        }

        // action.kind === "restore"
        const canRestore =
          !action.stale && confirmed.lifecycleStatus === "archived";
        if (!canRestore) {
          await expect(
            service.restore(SUBJECT, confirmed.id, {
              expectedVersion: usedVersion,
            }),
          ).rejects.toBeInstanceOf(ConflictException);
          await assertStatePreserved();
          continue;
        }
        const restored = await service.restore(SUBJECT, confirmed.id, {
          expectedVersion: usedVersion,
        });
        expect(restored.account.lifecycleStatus).toBe("active");
        assertInvariants(restored.account, confirmed);
        confirmed = restored.account;
      }
    },
  );

  it("delete eligibility is ineligible for a non-zero opening balance and eligible for zero", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const zero = await service.create(SUBJECT, validCreateBody("0"));
    const nonZero = await service.create(SUBJECT, validCreateBody("1"));
    const zeroEligibility = await service.evaluateDeleteEligibility(
      SUBJECT,
      zero.account.id,
    );
    const nonZeroEligibility = await service.evaluateDeleteEligibility(
      SUBJECT,
      nonZero.account.id,
    );
    expect(zeroEligibility.eligible).toBe(true);
    expect(nonZeroEligibility.eligible).toBe(false);
    expect(nonZeroEligibility.reasonCodes).toContain(
      "OPENING_BALANCE_NOT_ZERO",
    );
  });

  it("a starter Account with Opening Balance Rp0 and an onboarding dependency is not eligible", async () => {
    const store = new FakeAccountStore();
    const service = new AccountService({
      account: store,
    } as unknown as SessionStoreConnection);
    const starter = store.seedStarterAccount({
      name: "Starter",
      type: "cash",
      openingBalance: 0n,
      openingBalanceEffectiveDate: "2026-08-03",
    });

    const eligibility = await service.evaluateDeleteEligibility(
      SUBJECT,
      starter.id,
    );
    expect(eligibility.eligible).toBe(false);
    expect(eligibility.facts.openingBalanceZero).toBe(true);
    expect(eligibility.facts.hasOtherDependency).toBe(true);
    expect(eligibility.reasonCodes).toContain("DEPENDENCY_EXISTS");
    expect(eligibility.reasonCodes).not.toContain("OPENING_BALANCE_NOT_ZERO");
  });
});
