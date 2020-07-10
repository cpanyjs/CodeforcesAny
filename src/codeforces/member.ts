import {
  SubmissionDTO,
  UserDTO,
  RatingChangeDTO,
  HandleRating,
  Verdict
} from './type';

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
    this.submissions = [...data.submissions];
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
    this.handles.push({
      handle: member.handle,
      rating: member.rating,
      rank: member.rank,
      maxRating: member.maxRating,
      maxRank: member.maxRank
    });
    this.submissions.push(...member.submissions);
    this.ratingChanges.push(...member.ratingChanges);
    this.submissions.sort((lhs: SubmissionDTO, rhs: SubmissionDTO) => {
      if (lhs.id === rhs.id) {
        return 0;
      } else if (lhs.id < rhs.id) {
        return -1;
      } else {
        return 1;
      }
    });
    this.ratingChanges.sort((lhs: RatingChangeDTO, rhs: RatingChangeDTO) => {
      if (lhs.contestId === rhs.contestId) {
        return 0;
      } else if (lhs.contestId < rhs.contestId) {
        return -1;
      } else {
        return 1;
      }
    });
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
}
