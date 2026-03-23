import McqQuestion from "./questions/McqQuestion";
import SliderQuestion from "./questions/SliderQuestion";
import StatementQuestion from "./questions/StatementQuestion";
import RankingQuestion from "./questions/RankingQuestion";
import VisualQuestion from "./questions/VisualQuestion";
import FillinQuestion from "./questions/FillinQuestion";
import BinaryQuestion from "./questions/BinaryQuestion";
import ScaleQuestion from "./questions/ScaleQuestion";

const renderers = {
  mcq: McqQuestion,
  slider: SliderQuestion,
  statement: StatementQuestion,
  ranking: RankingQuestion,
  visual: VisualQuestion,
  fillin: FillinQuestion,
  binary: BinaryQuestion,
  scale: ScaleQuestion,
};

export default function QuizQuestion({ question, selected, onSelect }) {
  const Renderer = renderers[question.type] || McqQuestion;
  return <Renderer question={question} selected={selected} onSelect={onSelect} />;
}
