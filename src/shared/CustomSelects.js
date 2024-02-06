import React from "react";
import { useState } from "react";

import {
	Select,
	SelectOption
} from '@patternfly/react-core/deprecated';


const availablePools = ['default','minimal','managed-kafka','real-managed-kafka']
const availableDurations = ['1h','4h','8h','12h', '16h', '24h']

const DefaultPool = availablePools[0]
const DefaultDuration = availableDurations[0]

const SelectList = ({label, value, setValue, options}) => {
    const [isOpen, setIsOpen] = useState(false);
    return <React.Fragment>
        {label}
        <Select
            isOpen={isOpen}
            onToggle={() => { setIsOpen(!isOpen) } } 
            onSelect={(event, selection) => { setValue(selection) ; setIsOpen(false) } }
            selections={value}>
                {options.map((opt, index) => { return <SelectOption key={`${opt}-${index}`} value={opt}>
                    {opt}
                </SelectOption>})}
        </Select>
    </React.Fragment>    
}

const PoolSelectList = ({value, setValue}) => {
    return <SelectList label='Pool'  value={value} setValue={setValue} options={availablePools}/>
}

const DurationSelectList = ({value, setValue}) => {
    return <SelectList label='Duration'  value={value} setValue={setValue} options={availableDurations}/>
}

export {SelectList, PoolSelectList, DurationSelectList, DefaultPool, DefaultDuration}