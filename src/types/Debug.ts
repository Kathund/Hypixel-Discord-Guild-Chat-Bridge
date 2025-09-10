export interface RepoData {
  commit: string;
  branch: string;
  isMainBranch: boolean;
  repoOwner: string;
  repoName: string;
  isOnLatestCommit: boolean;
}

export interface VersionsData {
  node: string;
  pnpm: string;
}

export interface OsData {
  platform: NodeJS.Platform;
  release: string;
  type: string;
  arch: NodeJS.Architecture;
}

export interface ConfigData {
  config: string;
}
