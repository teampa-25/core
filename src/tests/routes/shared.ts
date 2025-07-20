import { UserRole } from "@/common/enums";
import { hashPassSync } from "@/common/utils/encryption";

class TestMemory {
  static adminPassword = "vera_baddie";
  static user1Password = "aphex_twin_twin";
  static user2Password = "fred_again_again_again_again_again";

  static hashedAdminPassword = hashPassSync(this.adminPassword);
  static hashedUser1Password = hashPassSync(this.adminPassword);
  static hashedUser2Password = hashPassSync(this.adminPassword);

  // static values
  static readonly admin = {
    email: "a_test_admin@example.org",
    password: this.hashedAdminPassword,
    role: UserRole.ADMIN,
  };

  static readonly user1 = {
    email: "a_new_user@example.org",
    password: this.hashedUser1Password,
    role: UserRole.USER,
  };

  static readonly user2 = {
    email: "a_new_user@example.org",
    password: this.hashedUser2Password,
    role: UserRole.USER,
  };

  static readonly dataset1 = {
    name: "a dataset name",
    tags: ["this", "is", "a", "new", "custom", "tag", "array", "list"],
  };

  static readonly dataset2 = {
    name: "a very new and never seen before dataset name",
    tags: ["another", "custom", "tags", "list"],
  };

  static readonly dataset3 = {
    name: "a very new and dummiesh dataset name",
    tags: ["another", "custom", "dummy", "list of dummies"],
  };

  static disableReset = false;

  static runtime: {
    user1Token: string;
    user2Token: string;
    adminToken: string;
    dataset1Id: string;
    dataset2Id: string;
  };

  static reset(): void {
    if (!this.disableReset) {
      (Object.keys(this.runtime) as (keyof typeof this.runtime)[]).forEach(
        (key) => {
          this.runtime[key] = "";
        },
      );
    }
  }
}

export default TestMemory;
