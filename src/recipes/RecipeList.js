import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dropdown,
  DropdownItem,
  MenuToggle
} from '@patternfly/react-core';
import { getDeployRecipes } from '../store/AppSlice';

export default function RecipeList({ onRecipeSelect }) {
  const recipes = useSelector(getDeployRecipes);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownTitle, setDropdownTitle] = useState('Select a Recipe');
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onSelect = (event) => {
    setIsOpen(!isOpen);
    const itemId = event.currentTarget.id;
    const recipe = recipes.find((recipe) => recipe.id === itemId);
    if (onRecipeSelect && recipe) {
      onRecipeSelect(recipe);
      setSelectedItem(recipe.name);
      // I like this feature and I think it should be kept
      // but things get weird after you delete a recipe
      // so I'm commenting it out for now
      //setDropdownTitle(recipe.name);
    }
  };

  useEffect(() => {
    if (selectedItem === null && recipes.length > 0) {
      setSelectedItem(recipes[0].name);
      onRecipeSelect(recipes[0]);
      //setDropdownTitle(recipes[0].name);
    }
  }, [recipes, selectedItem, onRecipeSelect]);

  return    <Dropdown  
            isOpen={isOpen} 
            onSelect={onSelect} 
            onOpenChange={isOpen => setIsOpen(isOpen)}
            isScrollable
             
            toggle={toggleRef => 
                <MenuToggle isFullWidth ref={toggleRef} onClick={onToggle} isExpanded={isOpen}>
                    { dropdownTitle }
                </MenuToggle>
            } ouiaId={dropdownTitle} shouldFocusToggleOnSelect>
                {recipes.map((recipe) => 
                    <DropdownItem key={recipe.id} id={recipe.id}>
                        {recipe.name}
                    </DropdownItem>
                )}
            </Dropdown>
}
