import {
  SubmissionDTO,
  UserDTO,
  RatingChangeDTO,
  HandleRating,
  Verdict,
  ParticipantType,
  ParticipateContest,
  ContestDTO
} from './type';
import { getProblemID } from './utils';
import { getContestById } from './store';

export class Member {
  name: string;
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  handles: HandleRating[];
  submissions: SubmissionDTO[];
  ratingChanges: RatingChangeDTO[];

  constructor(data: UserDTO) {
    this.name = data.name;
    this.handle = data.handle;
    this.email = data.email;
    this.rank = data.rank;
    this.rating = data.rating;
    this.maxRank = data.maxRank;
    this.maxRating = data.maxRating;
    this.submissions = [...data.submissions].sort(
      (lhs: SubmissionDTO, rhs: SubmissionDTO) => lhs.id - rhs.id
    );
    this.ratingChanges = [...data.ratingChanges];
    this.handles = [
      {
        handle: data.handle,
        rating: data.rating,
        rank: data.rank,
        maxRating: data.maxRating,
        maxRank: data.maxRank
      }
    ];
  }

  merge(member: Member) {
    if (this.name !== member.name) return false;
    if (member.rating > this.rating) {
      this.rating = member.rating;
      this.rank = member.rank;
      this.handle = member.handle;
    }
    if (member.maxRating > this.maxRating) {
      this.maxRating = member.maxRating;
      this.maxRank = member.maxRank;
    }

    this.submissions.push(...member.submissions);
    this.ratingChanges.push(...member.ratingChanges);
    this.submissions.sort((lhs, rhs) => lhs.id - rhs.id);
    this.ratingChanges.sort((lhs, rhs) => lhs.contestId - rhs.contestId);

    this.handles.push(...member.handles);
    this.handles.sort((lhs, rhs) => rhs.rating - lhs.rating);
  }

  remove(handle: string) {
    const id = this.handles.findIndex(val => val.handle === handle);
    if (id !== -1) {
      this.handles.splice(id, 1);
    }
    this.submissions = this.submissions.filter(
      value => !value.author.members.includes(handle)
    );
    this.ratingChanges = this.ratingChanges.filter(
      value => value.handle !== handle
    );
  }

  contests() {
    const result: ParticipateContest[] = this.ratingChanges.map(
      ({ contestId, contestName, newRating, oldRating, rank }) => ({
        contestId,
        contestName,
        type: ParticipantType.CONTESTANT,
        startTimeSeconds: (getContestById(contestId) as ContestDTO)
          .startTimeSeconds,
        ratingChange: newRating - oldRating,
        newRating,
        rank
      })
    );
    const set = new Set<number>(
      this.ratingChanges.map(({ contestId }) => contestId)
    );
    for (const sub of this.submissions) {
      if (sub.author.participantType === ParticipantType.VIRTUAL) {
        const contest = getContestById(sub.contestId);
        if (!set.has(sub.contestId) && contest) {
          set.add(sub.contestId);
          result.push({
            contestId: sub.contestId,
            contestName: contest.name,
            type: ParticipantType.VIRTUAL,
            startTimeSeconds: sub.creationTimeSeconds - sub.relativeTimeSeconds
          });
        }
      }
    }
    return result;
  }

  analyzeVerdict() {
    const map = new Map<Verdict, number>();
    for (const sub of this.submissions) {
      const verdict = sub.verdict;
      if (map.has(verdict)) {
        const val = map.get(verdict) as number;
        map.set(verdict, val + 1);
      } else {
        map.set(verdict, 1);
      }
    }
    const result: Array<[string, number]> = [];
    result.push(['OK', map.get(Verdict.OK) || 0]);
    result.push(['WA', map.get(Verdict.WRONG_ANSWER) || 0]);
    result.push(['TLE', map.get(Verdict.TIME_LIMIT_EXCEEDED) || 0]);
    result.push(['MLE', map.get(Verdict.MEMORY_LIMIT_EXCEEDED) || 0]);
    result.push(['RE', map.get(Verdict.RUNTIME_ERROR) || 0]);
    result.push(['ILE', map.get(Verdict.IDLENESS_LIMIT_EXCEEDED) || 0]);
    result.push(['CE', map.get(Verdict.COMPILATION_ERROR) || 0]);
    return result;
  }

  analyze1A() {
    const map = new Map<string, Array<Verdict>>();
    for (const sub of this.submissions) {
      const verdict = sub.verdict;
      const pid = getProblemID(sub);
      if (!map.has(pid)) {
        map.set(pid, []);
      }
      const vList = map.get(pid) as Array<Verdict>;
      if (vList.length === 0 || vList[vList.length - 1] !== Verdict.OK) {
        vList.push(verdict);
      }
    }
    const result: Array<[string, number]> = [
      ['1A', 0],
      ['+1', 0],
      ['+2', 0],
      ['+3', 0],
      ['+4', 0],
      ['+5', 0],
      ['+5 以上', 0]
    ];
    for (const [, value] of map) {
      if (value[value.length - 1] !== Verdict.OK) {
        continue;
      }
      switch (value.length) {
        case 1:
          result[0][1]++;
          break;
        case 2:
          result[1][1]++;
          break;
        case 3:
          result[2][1]++;
          break;
        case 4:
          result[3][1]++;
          break;
        case 5:
          result[4][1]++;
          break;
        case 6:
          result[5][1]++;
          break;
        default:
          result[6][1]++;
          break;
      }
    }
    return result;
  }
}
