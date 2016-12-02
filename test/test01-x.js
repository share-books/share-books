
import test from 'ava'


const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms)
  })
}

test('async call test', async t => {
    console.log("hi")
    await sleep(1000)
    console.log("show this after 1 second!")
    t.is( 2, 1+1)
})