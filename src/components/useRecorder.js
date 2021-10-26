import { useEffect, useState } from "react";

export const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [task, setTask] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    console.log({ isRecording, task });
    if (isRecording && task === "started") {
      console.log(1);
      recorder.start();
      console.log({ isRecording, task });
    } else if (!isRecording && task === "paused") {
      console.log(2);
      recorder.pause();
      console.log({ isRecording, task });
    } else if (isRecording && task === "resumed") {
      console.log(3);
      recorder.resume();
      console.log({ isRecording, task });
    } else if (!isRecording && task === "stoped") {
      console.log(4);
      recorder.stop();
      console.log({ isRecording, task });
    }

    // Obtain the audio when ready.
    const handleData = (e) => {
      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording, task]);

  const startRecording = () => {
    setIsRecording(true);
    setTask("started");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setTask("stoped");
  };

  const pauseRecording = () => {
    setIsRecording(false);
    setTask("paused");
  };
  const resumeRecording = () => {
    setIsRecording(true);
    setTask("resumed");
  };

  return [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    task,
  ];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}
