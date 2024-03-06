import { React, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
    Page,
    PageSection,
    Split,
    SplitItem,
    Title,
    TitleSizes,
    PageSectionVariants,
    Card,
    CardBody,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateBody,
    EmptyStateHeader,
    EmptyStateIcon,
    Stack,
    StackItem,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import RecipeList from './RecipeList';
import RecipeViewer from '../shared/RecipieViewer';
import { emptyState } from '../store/AppDeploySlice';
import { useSelector } from 'react-redux';
import { 
    getDeployRecipes,
    removeDeployRecipe,
    addDeployRecipe
} from '../store/AppSlice';
import { setAppDeployOptions } from '../store/AppDeploySlice';
import AppDeployModal from '../deploy/AppDeployModal';
import { v4 as uuidv4 } from 'uuid';


export default function Recipes() {

    const recipes = useSelector(getDeployRecipes);

    const dispatch = useDispatch();
    
    const [recipeListIsEmpty, setRecipeListIsEmpty] = useState(recipes.length === 0);
    const [recipe, setRecipe] = useState({name:"", id:"", deployOptions: emptyState})
    const [deployOptions, setDeployOptions] = useState(emptyState);
    const [recipeLoaded, setRecipeLoaded] = useState(false);

    const fileInputRef = useRef(null);

    const onRecipeSelect = (recipe) => {
        setRecipe(recipe);
        const recipeOpts = {...recipe.deployOptions};
        setDeployOptions(recipeOpts);
        dispatch(setAppDeployOptions(recipeOpts));
        setRecipeLoaded(true);
    }
    
    useEffect(() => {
        setRecipeListIsEmpty(recipes.length === 0);
    }, [recipes]);

    const deleteRecipe = () => {
        dispatch(removeDeployRecipe(recipe));
        setRecipeListIsEmpty(recipes.length === 0);
        setRecipe({name:"", id:"", deployOptions: emptyState});
        setDeployOptions(emptyState);
        setRecipeLoaded(false);
    }

    const downloadObjectAsJson = (obj, filename) => {
        const jsonStr = JSON.stringify(obj, null, 2); // Convert object to JSON string
        const blob = new Blob([jsonStr], { type: 'application/json' }); // Create a Blob with the JSON content
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
      
        // Create a temporary anchor element and set its attributes for download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append the anchor to the body
      
        a.click(); // Trigger the download
      
        document.body.removeChild(a); // Remove the anchor from the body
        URL.revokeObjectURL(url); // Release the created URL
      };

      const sanitizeFilename = (str) => {
        return str
          .toLowerCase() // Convert to lowercase
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .replace(/[<>:"\/\\|?*]+/g, ''); // Remove invalid filesystem characters
      };

    const downloadRecipe = () => {
        downloadObjectAsJson(recipe, `${sanitizeFilename(recipe.name)}.json`);
    }

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
            const obj = JSON.parse(e.target.result);
            if (validateSchema(obj)) {
                obj.id = uuidv4();
                dispatch(addDeployRecipe(obj));
            } else {
                alert('Upload Validaion Failure: Invalid file schema.');
            }
            } catch (error) {
            alert('Upload Validaion Failure: Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
        } else {
        alert('Please select a JSON file.');
        }
    };
      
    const validateSchema = (obj) => {
        // Check if the 'name' property exists and is a string
        if (typeof obj.name !== 'string') {
            console.log('Upload Validaion Failure: The "name" property must be a string.');
            return false;
        }

        // Check if the 'id' property does not exist
        if ('id' in obj) {
            console.log('Upload Validaion Failure: The object should not have an "id" property.');
            return false;
        }

        // Check if the 'deployOptions' property exists and is an object
        if (typeof obj.deployOptions !== 'object' || obj.deployOptions === null) {
            console.log('Upload Validaion Failure: The "deployOptions" property must be an object.');
            return false;
        }

        // Check if the 'deployOptions' object has an 'apps' array
        if (!Array.isArray(obj.deployOptions.apps)) {
            console.log('Upload Validaion Failure: The "deployOptions.apps" property must be an array.');
            return false;
        }

        // Check if the 'deployOptions' object has an 'app_names' array
        if (!Array.isArray(obj.deployOptions.app_names)) {
            console.log('Upload Validaion Failure: The "deployOptions.app_names" property must be an array.');
            return false;
        }

        // If all checks pass, return true
        return true;
    };

    const uploadRecipe = () => {
        fileInputRef.current.click();
    };

    const NoRecipeLoaded = () => {
        return <EmptyState variant={EmptyStateVariant.lg}>
            <EmptyStateHeader titleText="No Recipe Loaded" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                Select a recipe from the left to view its details.
            </EmptyStateBody>
        </EmptyState>
    }

    const NoRecipes = () => {
        return <CardBody>
            <EmptyState variant={EmptyStateVariant.lg}>
                <EmptyStateHeader titleText="No Recipes Found" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
                <EmptyStateBody>
                    No recipes found. You can create a recipe by going through the Deploy wizard or by uploading a recipe file.
                </EmptyStateBody>
            </EmptyState>
        </CardBody>
    }

    return <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split hasGutter>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Recipes
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
                <SplitItem>
                { recipeListIsEmpty ? <div/> : <RecipeList onRecipeSelect={(recipe) => onRecipeSelect(recipe)} /> }
                </SplitItem>
                <SplitItem>
                    <Button variant="secondary" onClick={uploadRecipe}>Upload</Button>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </SplitItem>
            </Split>
        </PageSection>
        <PageSection>
                { recipeListIsEmpty ? <NoRecipes /> : 
                    <Card isFullHeight>
                        <CardBody>
                                { recipeLoaded ?
                                    <Stack hasGutter isFullHeight > 
                                        <StackItem>
                                            <Split hasGutter>
                                                <SplitItem isFilled>
                                                    <Title headingLevel="h2" size={TitleSizes['2xl']}>
                                                        {recipe.name}
                                                    </Title>
                                                </SplitItem>
                                                <SplitItem>
                                                    <AppDeployModal />
                                                </SplitItem>
                                                <SplitItem>
                                                    <Button variant="secondary" onClick={downloadRecipe}>Download</Button>
                                                </SplitItem>
                                                <SplitItem>
                                                    <Button variant="danger" onClick={deleteRecipe}>Delete</Button>
                                                </SplitItem>
                                            </Split>
                                        </StackItem>
                                        <StackItem>
                                            <Card isPlain>
                                                <CardBody>
                                                    <RecipeViewer recipe={{...deployOptions}}/>
                                                </CardBody>
                                            </Card>
                                        </StackItem>
                                    </Stack> : 
                                    <NoRecipeLoaded />
                                }       

                        </CardBody>
                    </Card>
                }
        </PageSection>
    </Page> 
}