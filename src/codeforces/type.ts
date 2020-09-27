export interface HandleDTO {
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
}

export type UserDTO = HandleDTO & {
  name: string;
  submissions: SubmissionDTO[];
  ratingChanges: RatingChangeDTO[];
};

export interface HandleRating {
  handle: string;
  rating: number;
  rank: string;
  maxRating: number;
  maxRank: string;
}

export enum Verdict {
  OK = 'OK',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  WRONG_ANSWER = 'WRONG_ANSWER',
  PRESENTATION_ERROR = 'PRESENTATION_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  IDLENESS_LIMIT_EXCEEDED = 'IDLENESS_LIMIT_EXCEEDED',
  SECURITY_VIOLATED = 'SECURITY_VIOLATED',
  CRASHED = 'CRASHED',
  INPUT_PREPARATION_CRASHED = 'INPUT_PREPARATION_CRASHED',
  CHALLENGED = 'CHALLENGED',
  SKIPPED = 'SKIPPED',
  TESTING = 'TESTING',
  REJECTED = 'REJECTED'
}

export enum ParticipantType {
  CONTESTANT = 'CONTESTANT',
  PRACTICE = 'PRACTICE',
  VIRTUAL = 'VIRTUAL',
  MANAGER = 'MANAGER',
  OUT_OF_COMPETITION = 'OUT_OF_COMPETITION'
}

export interface ProblemDTO {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
}

export interface SubmissionDTO {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: ProblemDTO;
  author: {
    members: string[];
    participantType: ParticipantType;
  };
  programmingLanguage: string;
  verdict: Verdict;
}

export interface RatingChangeDTO {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  oldRating: number;
  newRating: number;
}

export interface ContestDTO {
  id: number;
  name: string;
  type: string; // enum: CF, IOI, ICPC
  phase: string; // enum: BEFORE, CODING, PENDING_SYSTEM_TEST, SYSTEM_TEST, FINISHED
  startTimeSeconds: number;
  durationSeconds: number;
}

export interface ProblemResultDTO {
  points: number;
  rejectedAttemptCount: number;
  bestSubmissionTimeSeconds: number;
}

export interface PartyDTO {
  members: Array<{ handle: string }>;
  teamId?: number;
  teamName?: string;
}

export interface RankListRowDTO {
  rank: number;
  teamName?: string;
  teamId?: number;
  handles: HandleDTO[];
  name: string;
  problemResults: ProblemResultDTO[];
  penalty: number;
  party: PartyDTO;
}

export interface ContestStandingsDTO {
  contest: ContestDTO;
  problems: ProblemDTO[];
  rows: RankListRowDTO[];
}

export interface ParticipateContest {
  contestId: number;
  contestName: string;
  type: ParticipantType;
  startTimeSeconds: number;
  ratingChange?: number;
  newRating?: number;
  rank?: number;
}
