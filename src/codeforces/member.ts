import { SubmissionDTO, UserDTO, RatingChangeDTO } from './type';

export class Member {
  name: string;
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
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
}
