Issue recalculating with the `<CellMeasurer />`
=====

The `<CellMeasurer />` doesn't seem to update the height for a particular `index` whenever
something is removed from the items array. The length changes and the cache is reset, but
it doesn't change the actual height of the item.

Getting started
---------------

```shell
$ yarn # or npm install
$ yarn start # or npm start
```

GIF of the example:
---------------------
![doesnt-recalculate](https://cloud.githubusercontent.com/assets/1291263/22104113/0faedbc0-de3e-11e6-8cdc-d3605486ccda.gif)
