
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

test('bool test', t => {
    let a={}
    let b=a.b

    t.is( undefined, b)
   // t.is( true, b===b)
    t.is( true, b==null)
    t.is( false, !!b)
    a.b=true
    t.is( true, b!=a.b)
})

test('obj test', t => {
    let a={b:1}
    let b=a
    b.b=2

    t.is( 2, a.b)
    a.b=3
    t.is( 3, b.b)

    a={b:4}
    t.is( true, b.b!=a.b)
})