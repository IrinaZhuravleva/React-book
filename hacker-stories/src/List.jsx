import {Item} from './Item';

export const List = ({list, onRemoveItem}) => (
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID} 
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  )

  export default List;