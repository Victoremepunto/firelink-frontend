import React from 'react';
import {Checkbox, DropdownToggle, DropdownItem, Dropdown, } from '@patternfly/react-core';
import {useState} from 'react';

function getUniqueValuesForPropertyInArrayOfObjects(sourceArray, sourceColumn) {
    const uniqueValues = new Set();
    sourceArray.forEach(item => {
        uniqueValues.add(String(item[sourceColumn]));
    } );
    let uniqueValuesArray = Array.from(uniqueValues);
    uniqueValuesArray = uniqueValuesArray.sort((a, b) => a.localeCompare(b));
    uniqueValuesArray.unshift("all");
    return uniqueValuesArray;
}

function ChangeFilter(column, newValue, filter, setFilter) {
    const newFilter = {...filter};
    newFilter[column] = newValue;
    setFilter(newFilter);
}

export default function FilterDropdown({sourceArray, sourceColumn, filter, setFilter}) {
    //const values = ["ready", "not ready", "all"]
    const [open, setOpen] = useState(false);
    var [selectedValue, setSelectedValue] = useState("all");
 
    const values = getUniqueValuesForPropertyInArrayOfObjects(sourceArray, sourceColumn);

    const toggle = <DropdownToggle id="toggle-basic" onToggle={()=>{setOpen(!open)}}>
      Filter: {selectedValue}
    </DropdownToggle>
  
    const items = values.map((value, i) => {
      return <DropdownItem key={value+i+"DropdownItem"}>
        <Checkbox label={value} isChecked={selectedValue === value} onChange={()=>{
            setSelectedValue(value);
            ChangeFilter(sourceColumn, value, filter, setFilter); 
            setOpen(!open)}
        } id={value+i+"Checkbox"}/>
      </DropdownItem>
    })
    
    return <Dropdown toggle={toggle} dropdownItems={items} isOpen={open}/>
  }
