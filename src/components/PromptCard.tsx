import { StyleSheet } from 'react-native';
import { getTopic, type Problem } from '../engine';
import { Card } from './Card';
import { Txt } from './Txt';

export function PromptCard({ problem }: { problem: Problem }) {
  const topic = getTopic(problem.topicId);
  return (
    <Card style={styles.card}>
      <Txt variant="captionStrong" color="inkMuted">
        {(topic?.name ?? '').toUpperCase()}
      </Txt>
      <Txt variant="math" selectable testID="problem-prompt">
        {problem.prompt}
      </Txt>
    </Card>
  );
}

export const LETTERS = ['A', 'B', 'C', 'D'];

const styles = StyleSheet.create({
  card: { marginBottom: 0 },
});
