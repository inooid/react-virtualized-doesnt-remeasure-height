import React from 'react';
import {
  List,
  CellMeasurer,
  idCellMeasurerCellSizeCache as idCellSizeCache,
} from 'react-virtualized';

class App extends React.Component {
  state = {
    items: [
      { id: 901, text: 'Item 1', height: 50, },
      { id: 902, text: 'Item 2', height: 100 },
      { id: 903, text: 'Item 3', height: 25, },
      { id: 904, text: 'Item 4', height: 200 },
    ]
  }

  constructor(...args) {
    super(...args);

    this.cache = new idCellSizeCache({
      indexToIdMap: (index) => this.state.items[index].id,
      uniformColumnWidth: true,
    });
  }

  removeItem = () => {
    const index = prompt('What index do you want to remove?');

    if (index) {
      const indexNum = Number(index);
      // Remove the element from the state
      this.setState((prevState) => ({
        ...prevState,
        items: [
          ...prevState.items.slice(0, indexNum),
          ...prevState.items.slice(indexNum + 1, prevState.items.length),
        ],
      }));

      // Recalculate the new heights from the index, based on the index changes
      this.list.recomputeRowHeights(index);
    }
  }

  render() {
    const { items } = this.state;
    const length = items.length;

    const rowRenderer = ({ index, style }) => {
      const item = items[index];
      const color = `rgba(255, 165, 0, ${index * 0.2}`

      return (
        <div key={item.id} style={style}>
          <div style={{ height: item.height, backgroundColor: color }}>
            { `${index}. ${item.text} (height: ${item.height}px)` }
          </div>
        </div>
      );
    };

    return (
      <div>
        <CellMeasurer
          cellSizeCache={this.cache}
          width={300}
          rowCount={length}
          columnCount={1}
          cellRenderer={rowRenderer}
        >
          { ({ getRowHeight }) => (
            <List
              ref={(list) => this.list = list}
              width={300}
              height={800}
              rowCount={length}
              rowHeight={getRowHeight}
              rowRenderer={rowRenderer}
            />
          ) }
        </CellMeasurer>

        <button onClick={this.removeItem}>Remove an item</button>
      </div>
    );
  }
}

export default App;
