import { motion } from 'framer-motion';
import React from 'react'
import { useState } from 'react';

const Loading = ({duration = 6}) => {
    const [currentValue, setCurrentValue] = useState(0);

    return (
        <div className=' bg-black min-h-screen flex flex-col justify-center items-center gap-8'>
            <motion.div className=' w-full sm:w-[500px] h-[300px]  bg-contain bg-no-repeat bg-center' style={{ backgroundImage: "url(/logo.png)" }}
              initial={{ x: -1000 }}
              animate={ currentValue > 80 ?{x: 0 }:{}}
              transition={{ duration: 1 }}
            
            >

            </motion.div>
            <div className=' w-5/6 text-right text-amber-300'>
                <motion.span className=''
                    initial={{ count: 0 }}
                    whileInView={{ count: 100 }}
                    transition={{ duration: duration , ease:"easeOut" }}
                    onUpdate={(latest) => setCurrentValue(Math.floor(latest.count))}
                >
                    {currentValue}
                </motion.span>
                <div className=' relative bg-red-400 w-full h-1'>
                    <motion.span className={` inline-block absolute w-fullmotion. h-1 bg-amber-300 top-0 left-0 `}
                    initial={{width:0}}
                    whileInView={{width:"100%"}}
                    transition={{ duration: duration , ease:"easeOut" }}
                    >
                    </motion.span>
                </div>
            </div>
        </div>
    )
}

export default Loading