import React, { useState, useEffect } from "react";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";

const App = () => {
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [type, setType] = useState(1);

  const getStartTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const roundedMinutes = 10 * Math.round(minutes / 10);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  const getEndTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Round up to the next multiple of 10 for minutes
    minutes = Math.ceil(minutes / 10) * 10;

    // Adjust hours and minutes if minutes are 60
    if (minutes >= 60) {
      minutes = 0;
      hours = (hours + 1) % 24; // Adjust for 24-hour format
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  const changeType = () => {
    if (type === 1) {
      setType(2);
    } else {
      setType(1);
    }
  }

  function createIfNotExists() {
    const jsonFilePath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(jsonFilePath)) {
        fs.writeFileSync(jsonFilePath, JSON.stringify([]));
    }
  }

  // write to json file
  const writeData = () => {
    createIfNotExists();

    let data = [];
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const today = new Date();
    
    data.push({
        date: today.toISOString(),
        start_time: startTime,
        end_time: endTime,
        type: type
    });

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  }

  const onClick = () => {
    if (!started) {
      setStarted(true);
      const startTime = getStartTime();
      console.log("start time", startTime)
      setStartTime(startTime);
      return
    }
    // end
    console.log(timeElapsed);
    const endTime = getEndTime();
    console.log("end time", endTime)
    setEndTime(endTime);
    writeData();
    setTimeElapsed(0);
    setStarted(false);
  }

  useEffect(() => {
    let interval = null;

    if (started) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000); // Update time every second
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [started])

  return (
      <Flex
        height="100vh" // Full height of the viewport
        alignItems="center" // Vertically centers content in the container
        justifyContent="center" // Horizontally centers content in the container
      >
        <VStack>
          <Button width="100px" colorScheme="blue" onClick={changeType}>
            { type }
          </Button>
          <Button width="100px" colorScheme="blue" onClick={onClick}>
            { started ? `${Math.floor(timeElapsed / 60)} mins` : "Start"}
          </Button>
        </VStack>
        
      </Flex>
  )
};


export default App