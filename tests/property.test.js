const request = require('supertest');
const {app, server} = require('./../app');

test('should retrieve all the properties', (done) => {
    request(app)
        .get('/property/')
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.property.length).toBe(100);
        })
        .end(done);
});

test('should retrieve correct property by id', (done) => {
    var id = 1;
    request(app)
        .get('/property/' + id)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.property[0].propertyId).toBe(1);
            expect(res.body.property.length).toBe(1);
        })
        .end(done);
})


// The following test will be modified to include many different combinations of 
// filters. Right now it just applies one test to check the functioning of endpoints
// other combinations will be added soon. 
test('should retrieve correct filtered properties', (done) => {
    var property = {
        price : {
            min : 2000000,
            max : 4000000
        },
        totalSqft : {
            min : 4000,
            max : 10000
        },
        isGym : true,
        isHospital : true,
        isSchool : true
    }

    request(app)
        .post('/property/filter')
        .send(property)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done)
})


afterAll(async () => {
    await server.close();        
});