import React, { Component } from 'react';
import Faker from 'faker';
import {
  List,
  CellMeasurer,
  idCellMeasurerCellSizeCache as idCellSizeCache,
} from 'react-virtualized';

/**
 * Generates an array of 100 objects with random data
 * @return {Array} An array with objects containing the random data
 */
const generateList = () => Array.apply(null, { length: 100 }).map(() => ({
  id: Faker.random.uuid(),
  text: Faker.lorem.text(),
  color: Faker.commerce.color(),
}));

/**
 * Builds the cache map that maps the index to the item id
 * @param  {Array}  items The array of items that you're trying to render
 * @return {Object} The Object that maps the index to the item id
 */
const createCacheMap = (items) => {
  const map = {};
  const length = items.length;

  if (length === 0) return {};

  for (let i = 0; i < length; i++) {
    map[i] = items[i].id;
  }

  return map;
}

/**
 * The rowRenderer function that creates the function that will be passed as the
 * rowRenderer.
 * @param  {Array}           options.items      The array of objects to render
 * @param  {Function}        options.removeItem The function to remove a particular item
 *
 * @return {Function : React.Component} A function that creates the rowRenderer that renders
 *                                      the react nodes.
 */
const createRowRenderer = ({ items, removeItem }) => ({ index, style }) => {
  const item = items[index];

  return (
    <div key={item.id} style={style}>
      <div style={{ borderBottom: '1px solid gray', padding: '20px', backgroundColor: item.color, height: '100%' }}>
        { `${index}. ${item.text}` }
        <button onClick={removeItem(index)}>Delete this item</button>
      </div>
    </div>
  );
};

class App extends Component {
  state = { items: [] }

  constructor(...args) {
    super(...args);

    // Set the initial cache (eventhough there are no items)
    this.setCache(this.state);
  }

  componentDidMount() {
    // When the component is mounted, fetch the data.
    this.fetch();
  }

  componentWillUpdate(nextProps, nextState) {
    // Whenever the state changes, build a new cache (for debugging)
    this.setCache(nextState);
  }

  /**
   * Creates the cache based on the current items state and sets it as a
   * property to the class instance.
   * @param  {Object} nextState The state object
   */
  setCache = (nextState = this.state) => {
    this.indexToIdMap = createCacheMap(nextState.items);
    this.cache = new idCellSizeCache({
      indexToIdMap: (index) => this.indexToIdMap[index],
      uniformColumnWidth: true,
    });
  }

  /**
   * Simulate doing an XHR request for fetching the data
   */
  fetch = () => {
    setTimeout(() => {
      this.setState(prevState => ({ items: generateList() }))
    }, 500);
  }

  /**
   * Calls resetMeasurements() on the cellMeasurer, which should bust the cache.
   */
  bustCache = () => {
    if (this.cellMeasurer) {
      console.log('cellMeasurer exists', this.cellMeasurer);
      console.log('Time to call resetMeasurements()');
      this.cellMeasurer.resetMeasurements();
    }
  }

  /**
   * Removes an item from the state for the given index
   * @param  {Number} The index number to slice off of the items state
   * @return {Function} The function to be passed as an onClick handler
   *                    (receives event parameter, but we ignore it for now)
   */
  removeItem = (index) => () => {
    this.bustCache();
    this.setState(prevState => ({
      ...prevState,
      items: [
        ...prevState.items.slice(0, index),
        ...prevState.items.slice(index + 1, prevState.items.length),
      ],
    }));
  }

  render() {
    const { items } = this.state;
    const length = items.length;
    const width = 300;
    const rowRenderer = createRowRenderer({ items, removeItem: this.removeItem });

    return (
      <div className="App">
        <div style={{ margin: '0 auto', width, }}>
          <CellMeasurer
            ref={(cellMeasurer) => this.cellMeasurer = cellMeasurer}
            cellSizeCache={this.cache}
            width={width}
            rowCount={length}
            columnCount={1}
            cellRenderer={rowRenderer}
          >
            { ({ getRowHeight }) => (
              <List
                width={width}
                height={800}
                rowCount={length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
              />
            ) }
          </CellMeasurer>
        </div>
      </div>
    );
  }
}

export default App;
