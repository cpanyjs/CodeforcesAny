import { SubmissionDTO, Verdict } from './type';

export function getProblemID(sub: SubmissionDTO) {
  return sub.contestId + sub.problem.index;
}

export function filterAC(subs: SubmissionDTO[]) {
  const pids = new Set<string>();
  const result: SubmissionDTO[] = [];
  subs
    .filter(sub => sub.verdict === Verdict.OK)
    .forEach(sub => {
      const id = getProblemID(sub);
      if (!pids.has(id)) {
        pids.add(id);
        result.push(sub);
      }
    });
  return result;
}
