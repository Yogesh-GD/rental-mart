import { motion } from 'framer-motion';
import React from 'react'
import { useState } from 'react';

const CounterAnimation = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(0);
    return (
        <motion.span
            initial={{ count: 0 }}
            whileInView={{ count: value }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onUpdate={(latest) => setCurrentValue(Math.floor(latest.count))}
            >
            {currentValue}
        </motion.span>
    )
}

export default CounterAnimation