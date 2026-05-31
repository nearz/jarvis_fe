// export type ThreadMark = {
//   type: string;
//   elemID: string;
//   content: string;
// };

export type ThreadMark = UserMark | AiH1Mark | AiH2Mark;

export type UserMark = {
  type: "user";
  elemID: string;
  content: string;
};

export type AiH2Mark = {
  type: "ai-h2";
  elemID: string;
  content: string;
};

export type AiH1Mark = {
  type: "ai-h1";
  elemID: string;
  content: string;
  h2Marks: AiH2Mark[];
};
