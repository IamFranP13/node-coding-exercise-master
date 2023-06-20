const jsonRemover = require('../src/utils/jsonRemover');
const fs = require('fs');


const mockData = {
    "versions": [
        {
            "objects": [
                {
                    "_id": "1",
                    "name": "object1",
                    "fields": [
                        { "_id": "f1", "name": "field1", "key": "key1" },
                        { "_id": "f1", "name": "field1", "key": "key1" }
                    ]
                },
                {
                    "_id": "1",
                    "name": "object1",
                    "fields": [
                        { "_id": "f2", "name": "field2", "key": "key2" },
                        { "_id": "f3", "name": "field3", "key": "key3" }
                    ]
                }
            ]
        }
    ]
};

beforeEach(() => {
    jest.spyOn(fs, 'writeFile').mockImplementation((_, __, ___, cb) => cb(null));
    jest.spyOn(fs, 'readFile').mockImplementation((_, __, cb) => cb(null, JSON.stringify(mockData)));
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('jsonRemover', () => {


    test('removeDuplicateFields should remove duplicate fields', () => {
        const object = mockData.versions[0].objects[0];
        const newObj = jsonRemover.removeDuplicateFields(object);
        expect(newObj.fields.length).toBe(1);
    });

    test('removeDuplicateObjects should remove duplicate objects', () => {
        const version = mockData.versions[0];
        const newVersion = jsonRemover.removeDuplicateObjects(version);
        expect(newVersion.objects.length).toBe(1);
    });

    test('removeDuplicates does not remove anything when there are no duplicates', async () => {

        const input = {
            "versions": [
                {
                    "objects": [
                        {
                            "_id": "object_1",
                            "name": "Object 1",
                            "fields": [
                                {
                                    "_id": "field_1",
                                    "name": "Field 1",
                                    "key": "key_1"
                                },
                                {
                                    "_id": "field_2",
                                    "name": "Field 2",
                                    "key": "key_2"
                                }
                            ]
                        },
                        {
                            "_id": "object_2",
                            "name": "Object 2",
                            "fields": [
                                {
                                    "_id": "field_3",
                                    "name": "Field 3",
                                    "key": "key_3"
                                },
                                {
                                    "_id": "field_4",
                                    "name": "Field 4",
                                    "key": "key_4"
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const expectedOutput = JSON.parse(JSON.stringify(input));

        const output = JSON.parse(JSON.stringify(input));
        for (let i = 0; i < output.versions.length; i++) {
            output.versions[i] = jsonRemover.removeDuplicateObjects(output.versions[i]);
        }

        expect(output).toEqual(expectedOutput);
    });


});
