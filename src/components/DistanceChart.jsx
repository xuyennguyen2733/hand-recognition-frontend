import { useState } from 'react';
import { Line } from 'react-chartjs-2';

const DistanceChart = ({distance}) => {
    if (!!!distance) {
        return <></>
    }
    const [distances, setDistances] = useState([]); // Array to hold logged distances
    const [timeLabels, setTimeLabels] = useState([]); // Array to hold time labels

    // Simulate adding a new distance
    const addDistance = () => {
        setDistances((prev) => [...prev, distance]);
        setTimeLabels((prev) => [...prev, prev.length + 1]); // Increment time step
    };

    const data = {
        labels: timeLabels, // X-axis (time points)
        datasets: [
            {
                label: 'Distance',
                data: distances, // Y-axis (distances)
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        animation: false, // No animation for real-time effect
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Distance' } },
        },
    };

    return (
        <div>
            <button onClick={addDistance}>Log Distance</button>
            <Line data={data} options={options} />
        </div>
    );
};

export default DistanceChart;
