const playSound = () => {
  const audio = new Audio("/sounds/ene-goshujin.mp3");
  audio.volume = 0.2;
  audio.play();
};

export default playSound;
