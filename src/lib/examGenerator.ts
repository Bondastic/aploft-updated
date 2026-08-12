import type { Education, Task, Track } from "../types";
import { tasksForEducation, tasksForTrack } from "./curriculum";
export type ExamTrack = Track | "fuld" | "ultimativ";
function shuffle<T>(arr:T[]):T[]{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Exports are scoped task identities; retained only for UI copy/counts.
export const ALL_TASKS = tasksForEducation("stx");
export const ALL_HHX_TASKS = tasksForEducation("hhx");
/** Fails closed: a track outside the selected education has an empty pool. */
export function poolForTrack(track:ExamTrack,education:Education="stx"):Task[]{
 if(track==="almen"||track==="latin"||track==="hhx") return tasksForTrack(education,track);
 return tasksForEducation(education);
}
export function generateExam(track:ExamTrack,count:number,education:Education="stx"):Task[]{const shuffled=shuffle(poolForTrack(track,education));if(count>=shuffled.length)return shuffled;const byCategory=new Map<string,Task[]>();for(const t of shuffled){const list=byCategory.get(t.category)??[];list.push(t);byCategory.set(t.category,list);}const categories=shuffle([...byCategory.keys()]);const result:Task[]=[];let idx=0;while(result.length<count&&categories.length){const list=byCategory.get(categories[idx%categories.length])!;if(list.length)result.push(list.shift()!);idx++;}return shuffle(result);}
export const AVG_SECONDS_PER_QUESTION=40;
export function estimateMinutes(count:number){return Math.max(1,Math.round(count*AVG_SECONDS_PER_QUESTION/60));}
