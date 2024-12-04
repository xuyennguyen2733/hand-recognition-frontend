import { useEffect, useRef, useState } from "react";
import useHand from "../hooks/useHand";
import { Box, Button } from "@mui/material";
import AnimatedGraph from "./AnimatedGraph";

function HandDataCollectionControlled({resultLandmarks}) {
    const sequence = useRef([]);
    const sequences = useRef([]);
    const [collecting, setCollecting] = useState(false);
    const targetLength = 15;
    
    const clearSequences = () => {
        sequences.current = [];
    }
    
    const sampleData = () => {
        if (sequence.current.length < targetLength) {
            for (let i = 0; i < targetLength - sequence.length; i++) {
                sequence.current.push(sequence.current[sequence.current.length-1])
            }
        }
        else if (sequence.current.length > targetLength) {
            
        }
    }
    
    useEffect(() => {
        if (collecting) {
            if (resultLandmarks.length > 0) {
                sequence.current.push(resultLandmarks);
            }
            else if (sequence.current.length > 0) {
                sequences.current.push(sequence.current);
                sequence.current = []
            }
        }
        else if (sequences.current.length > 0){
            sequence.current = []
        }
    }, [resultLandmarks])
    
  return <Box>
    <Button variant="contained" sx={{
        '&:focus': {
            outline: 'none'
        }
    }} onClick={() => setCollecting(!collecting)}>{collecting ? 'stop collecting' : 'start collecting'}</Button>
    <Button variant='contained' sx={{
        '&:focus': {
            outline: 'none'
        }
    }} onClick={clearSequences}>Clear sequences: {sequences.current.length}</Button>
    <AnimatedGraph frameSets={sequences.current} />
  </Box>;
}

export default HandDataCollectionControlled;
