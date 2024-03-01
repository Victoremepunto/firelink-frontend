import { React } from 'react';
import { useState } from 'react';

import {
    Page,
    PageSection,
    TextContent,
    Text,
    Split,
    SplitItem,
    Title,
    TitleSizes,
    PageSectionVariants,
    Card,
    CardBody,
    Grid,
    GridItem,
    TextVariants
} from '@patternfly/react-core';
import RecipeList from './RecipeList';
import RecipeViewer from '../store/RecipieViewer';
import { emptyState } from '../store/AppDeploySlice';

export default function Recipes() {

    const [recipe, setRecipe] = useState({name:"", id:"", deployOptions: emptyState})
    const [deployOptions, setDeployOptions] = useState(emptyState);
    const onRecipeSelect = (recipe) => {
        setRecipe(recipe);
        setDeployOptions({...recipe.deployOptions});
    }

    return <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Recipes
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
            </Split>
        </PageSection>
        <PageSection hasOverflowScroll>
            <Card>
                <CardBody>
                    <Grid hasGutter>
                        <GridItem span={3}>
                            <RecipeList onRecipeSelect={(recipe) => onRecipeSelect(recipe)} />
                        </GridItem>
                        <GridItem span={9}>
                            <RecipeViewer recipe={{...deployOptions}}/>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        </PageSection>
    </Page> 
}