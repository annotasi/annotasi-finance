import {
  accountIdSchema,
  accountLifecycleActionRequestSchema,
  createAccountRequestSchema,
  renameAccountRequestSchema,
  type Account,
  type AccountResponse,
  type DeleteEligibilityResponse,
  type ListAccountsResponse,
} from "@annotasi/contracts";
import {
  AccountStoreError,
  type AccountRecord,
  type SessionStoreConnection,
} from "@annotasi/database/runtime";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { SESSION_STORE_CONNECTION } from "../identity-session/session-store.token.js";

const MAX_RUPIAH = 9_223_372_036_854_775_807n;

const SAFE_SCOPE_REJECTION = {
  code: "ACCOUNT_SCOPE_REJECTED",
  message: "Workspace pribadi belum tersedia.",
};

function isRealDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (match === null) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function toAccount(record: AccountRecord): Account {
  return {
    id: record.id,
    name: record.name,
    type: record.type,
    openingBalance: record.openingBalance.toString(),
    openingBalanceEffectiveDate: record.openingBalanceEffectiveDate,
    totalBalance: record.totalBalance.toString(),
    unallocatedBalance: record.unallocatedBalance.toString(),
    lifecycleStatus: record.lifecycleStatus,
    isStarter: record.isStarter,
    version: record.version.toString(),
  };
}

@Injectable()
export class AccountService {
  public constructor(
    @Inject(SESSION_STORE_CONNECTION)
    private readonly connection: SessionStoreConnection,
  ) {}

  public async list(externalSubject: string): Promise<ListAccountsResponse> {
    const accounts = await this.run(() =>
      this.connection.account.list(externalSubject),
    );
    return { accounts: accounts.map(toAccount) };
  }

  public async create(
    externalSubject: string,
    body: unknown,
  ): Promise<AccountResponse> {
    const parsed = createAccountRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "ACCOUNT_CREATE_INVALID",
        message: "Data akun baru belum valid.",
      });
    }
    const openingBalance = BigInt(parsed.data.openingBalance);
    if (
      openingBalance > MAX_RUPIAH ||
      !isRealDateOnly(parsed.data.openingBalanceEffectiveDate)
    ) {
      throw new BadRequestException({
        code: "ACCOUNT_CREATE_INVALID",
        message: "Saldo atau tanggal saldo awal belum valid.",
      });
    }
    const record = await this.run(() =>
      this.connection.account.create(externalSubject, {
        name: parsed.data.name,
        type: parsed.data.type,
        openingBalance,
        openingBalanceEffectiveDate: parsed.data.openingBalanceEffectiveDate,
      }),
    );
    return { account: toAccount(record) };
  }

  public async rename(
    externalSubject: string,
    accountId: string,
    body: unknown,
  ): Promise<AccountResponse> {
    const id = this.parseAccountId(accountId);
    const parsed = renameAccountRequestSchema.safeParse(body);
    if (!parsed.success) {
      const onlyNameInvalid = parsed.error.issues.every(
        (issue) => issue.path.length === 1 && issue.path[0] === "name",
      );
      if (onlyNameInvalid) {
        throw new BadRequestException({
          code: "ACCOUNT_NAME_INVALID",
          message: "Nama akun tidak valid.",
        });
      }
      throw new BadRequestException({
        code: "ACCOUNT_REQUEST_INVALID",
        message: "Permintaan tidak valid.",
      });
    }
    const record = await this.run(() =>
      this.connection.account.rename(
        externalSubject,
        id,
        parsed.data.name,
        BigInt(parsed.data.expectedVersion),
      ),
    );
    return { account: toAccount(record) };
  }

  public async archive(
    externalSubject: string,
    accountId: string,
    body: unknown,
  ): Promise<AccountResponse> {
    const id = this.parseAccountId(accountId);
    const expectedVersion = this.parseExpectedVersion(body);
    const record = await this.run(() =>
      this.connection.account.archive(externalSubject, id, expectedVersion),
    );
    return { account: toAccount(record) };
  }

  public async restore(
    externalSubject: string,
    accountId: string,
    body: unknown,
  ): Promise<AccountResponse> {
    const id = this.parseAccountId(accountId);
    const expectedVersion = this.parseExpectedVersion(body);
    const record = await this.run(() =>
      this.connection.account.restore(externalSubject, id, expectedVersion),
    );
    return { account: toAccount(record) };
  }

  public async evaluateDeleteEligibility(
    externalSubject: string,
    accountId: string,
  ): Promise<DeleteEligibilityResponse> {
    const id = this.parseAccountId(accountId);
    const result = await this.run(() =>
      this.connection.account.evaluateDeleteEligibility(externalSubject, id),
    );
    return {
      accountId: result.accountId,
      eligible: result.eligible,
      reasonCodes: [...result.reasonCodes],
      facts: { ...result.facts },
    };
  }

  private parseAccountId(accountId: string): string {
    const parsed = accountIdSchema.safeParse(accountId);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "ACCOUNT_REQUEST_INVALID",
        message: "Permintaan tidak valid.",
      });
    }
    return parsed.data;
  }

  private parseExpectedVersion(body: unknown): bigint {
    const parsed = accountLifecycleActionRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "ACCOUNT_REQUEST_INVALID",
        message: "Permintaan tidak valid.",
      });
    }
    return BigInt(parsed.data.expectedVersion);
  }

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (!(error instanceof AccountStoreError)) throw error;
      switch (error.code) {
        case "ACCOUNT_SCOPE_REJECTED":
          throw new ForbiddenException(SAFE_SCOPE_REJECTION);
        case "ACCOUNT_NOT_FOUND":
          throw new NotFoundException({
            code: "ACCOUNT_NOT_FOUND",
            message: "Akun tidak ditemukan.",
          });
        case "ACCOUNT_NOT_ACTIVE":
          throw new ConflictException({
            code: "ACCOUNT_NOT_ACTIVE",
            message: "Akun tidak dalam status aktif.",
          });
        case "ACCOUNT_NOT_ARCHIVED":
          throw new ConflictException({
            code: "ACCOUNT_NOT_ARCHIVED",
            message: "Akun tidak dalam status diarsipkan.",
          });
        case "ACCOUNT_ARCHIVE_BALANCE_NON_ZERO":
          throw new ConflictException({
            code: "ACCOUNT_ARCHIVE_BALANCE_NON_ZERO",
            message:
              "Akun ini masih memiliki saldo yang tersisa dan tidak dapat diarsipkan.",
          });
        case "ACCOUNT_CONFLICT":
          throw new ConflictException({
            code: "ACCOUNT_CONFLICT",
            message:
              "Akun telah diperbarui oleh permintaan lain. Data akan dimuat ulang.",
          });
        default:
          throw error;
      }
    }
  }
}
