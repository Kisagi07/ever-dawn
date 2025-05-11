const newEndTime = (seconds: number, callback: (newEndTime: number) => void) => {
  const newEndTime = Date.now() + seconds * 1000;
  callback(newEndTime);
};
export default newEndTime;
