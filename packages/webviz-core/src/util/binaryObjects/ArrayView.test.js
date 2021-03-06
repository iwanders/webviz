// @flow
//
//  Copyright (c) 2020-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import getArrayView from "./ArrayView";

describe("ArrayView", () => {
  describe("length", () => {
    it("works with arrays of zero length", () => {
      const storage = new Int32Array([]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      const arrayView = new ArrayView(0, 0);
      expect(arrayView.length()).toBe(0);
    });

    it("works with arrays of positive length", () => {
      const storage = new Int32Array([1, 2, 3]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      expect(new ArrayView(0, 3).length()).toBe(3);
      expect(new ArrayView(4, 2).length()).toBe(2);
      expect(new ArrayView(4, 1).length()).toBe(1);
      expect(new ArrayView(8, 1).length()).toBe(1);
      expect(new ArrayView(12, 0).length()).toBe(0);
    });
  });

  describe("get", () => {
    it("gets values in-bounds", () => {
      const storage = new Int32Array([1, 2, 3]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      expect(new ArrayView(0, 3).get(0)).toBe(1);
      expect(new ArrayView(0, 3).get(2)).toBe(3);

      expect(new ArrayView(4, 1).get(0)).toBe(2);
      expect(new ArrayView(8, 1).get(0)).toBe(3);
    });

    it("does not bounds-check", () => {
      const storage = new Int32Array([1, 2, 3]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      expect(new ArrayView(0, 1).get(2)).toBe(3);
      // Accessing out of bounds of the whole buffer will throw, though.
      expect(() => new ArrayView(0, 3).get(4)).toThrow();
    });
  });

  describe("iteration", () => {
    it("works with arrays of zero length", () => {
      const storage = new Int32Array([]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      const arrayView = new ArrayView(0, 0);
      expect([...arrayView]).toEqual([]);
    });

    it("works with arrays of positive length", () => {
      const storage = new Int32Array([1, 2, 3]);
      const dataView = new DataView(storage.buffer);
      const getter = (i) => dataView.getInt32(i, true);

      const ArrayView = getArrayView<number>(getter, 4);
      expect([...new ArrayView(0, 3)]).toEqual([1, 2, 3]);
      expect([...new ArrayView(4, 2)]).toEqual([2, 3]);
      expect([...new ArrayView(4, 1)]).toEqual([2]);
      expect([...new ArrayView(8, 1)]).toEqual([3]);
      expect([...new ArrayView(12, 0)]).toEqual([]);
    });
  });
});
