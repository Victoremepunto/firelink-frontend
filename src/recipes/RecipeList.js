import React from 'react';
import {
    Menu,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuContent,
    Divider
} from '@patternfly/react-core';

import {
    getDeployRecipes,
    getRecipeById
} from '../store/AppSlice';

import { useSelector, useDispatch } from 'react-redux';

export default function RecipeList({onRecipeSelect}) {
    const recipes = useSelector(getDeployRecipes);

    const menuSelect = (_event, itemId) => {
        const recipe = recipes.find((recipe) => recipe.id === itemId);
        if (onRecipeSelect && recipe) {
            onRecipeSelect(recipe);
        }
    }

    return <Menu isPlain onSelect={menuSelect}>
        <MenuList>
            <MenuContent>
                {recipes.map((recipe) => {
                    return <React.Fragment key={recipe.id}> 
                        <MenuItem itemId={recipe.id} key={recipe.id} description={recipe.description}>
                            {recipe.name}
                        </MenuItem>
                        <Divider/>
                    </React.Fragment>
                })}
            </MenuContent>
        </MenuList>
    </Menu>
}