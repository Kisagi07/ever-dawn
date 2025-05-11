const playSound = ({ volume } = { volume: 0.2 }) => {
  const audio = new Audio("/sounds/ene-goshujin.mp3");
  audio.volume = volume;
  audio.play();
};

export default playSound;
