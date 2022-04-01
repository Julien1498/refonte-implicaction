import http from 'k6/http';
import { sleep, check } from 'k6';

const API_URL = `${__ENV.API_URI}`;
const PORT = `${__ENV.PORT}`;

function getToken() {
    const payload = JSON.stringify({
        username: 'admin',
        password: 'password',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginRes = http.post('http://'+API_URL+':'+PORT+'/api/auth/login', payload, params);

    check(loginRes, {
        'Login status is 200': (r) => r.status === 200,
        'Is Authenticated': (r) => r.json().authenticationToken
    });

    return loginRes.json().authenticationToken;
}

function should_return_200(url) {
    const res = http.get(url);
    check(res, { 'Status is 200': (r) => r.status === 200 });
}

export default function () {

    const options = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };

    should_return_200('http://'+API_URL+':'+PORT+'/api/users');

    const res = http.get('http://'+API_URL+':'+PORT+'/api/users/1');

    check(res, {
        'Status user is 200': (r) => r.status === 200,
        'Username is correct': (r) => r.json().username === 'matthieu',
    })

    const payload = JSON.stringify({
        id: '1',
        email: 'test@test.com'
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const resUpdateUser = http.put('http://'+API_URL+':'+PORT+'/api/users', payload, params)

    check(resUpdateUser, {'Status update user is 200': (r) => r.status === 200})

    const resdUserUpdated = http.get('http://'+API_URL+':'+PORT+'/api/users/1');

    check(resdUserUpdated, {
        'Status updated user is 200': (r) => r.status === 200,
        'Email is correct': (r) => r.json().email === 'test@test.com',
    })

    sleep(1);
}
