export default function filterTasksByClientClassification(
  tasks: TaskData[],
  client: Client
): TaskData[] {
  return tasks.filter(({ classification }): boolean => {
    return Object.keys(classification).reduce<boolean>((acc, key): boolean => {
      const classifiers = classification[key];
      if (classifiers) {
        return (
          acc &&
          classifiers.some(
            (val: string | number): boolean => val === client[key]
          )
        );
      }
      return acc;
    }, true);
  });
}
