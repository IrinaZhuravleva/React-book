import * as React from 'react';
import { InputWithLable } from './Input';
import { List } from './List';
import { getAsyncStories } from './GetAsyncStories';
import { useStorageState } from './UseStorageState';

const App = () => {
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(
            story => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
    );
    React.useEffect(() => {;
      dispatchStories({ type: 'STORIES_FETCH_INIT' });
  
      getAsyncStories()
        .then(result => {
          dispatchStories({
            type: 'STORIES_FETCH_SUCCESS',
            payload: result.data.stories,
          });
          setIsLoading(false);
        })
        .catch(() => 
          // setIsError(true)
          dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
        );
    }, []);
  
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // то, что мы вбиваем в инпут поиска
  };

  const searchedStories = stories.data.filter((story) => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My stories</h1>
      <InputWithLable
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      ><strong>Search:</strong>
        </InputWithLable>
      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
      <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
      )}
    </div> 
  )
};

export default App;

