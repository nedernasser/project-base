import 'reflect-metadata'

import 'mocha'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {expect} from 'chai'
import {Mock, It, Times} from 'moq.ts'
import JWTToken, {JWTService} from 'src/services/token/jwt.service'
import {IRedisCli} from 'src/lib/redis'
import {step} from 'mocha-steps'

describe('JWT token', () => {
  let jwtToken: JWTToken

  step('Must be generate valid JWT token', async () => {
    const redisMock = new Mock<IRedisCli>()
      .setup(i => i.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()))
      .returns(Promise.resolve())
      .setup(i => i.delete(It.IsAny<string>()))
      .returns(Promise.resolve())

    const jwtService = new JWTService(redisMock.object())

    jwtToken = await jwtService.generate({anyValue: 123})

    redisMock.verify(instance => instance.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()), Times.Once())
    redisMock.verify(instance => instance.get(It.IsAny<string>()), Times.Never())
    redisMock.verify(instance => instance.delete(It.IsAny<string>()), Times.Never())

    expect(jwtToken).keys('accessToken', 'refreshToken', 'expiresIn')

    const decoded = jwt.verify(jwtToken.accessToken, process.env.JWT_SECRET as string) as JwtPayload

    expect((decoded.exp as number) - (decoded.iat as number)).to.equal(jwtToken.expiresIn / 1000)
    expect(decoded.data.anyValue).to.equal(123)
  })

  step('Must be validate jwt', async () => {
    const redisMock = new Mock<IRedisCli>()
      .setup(i => i.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()))
      .returns(Promise.resolve())
      .setup(i => i.get(It.IsAny<string>()))
      .returns(Promise.resolve())
      .setup(i => i.delete(It.IsAny<string>()))
      .returns(Promise.resolve())

    const jwtService = new JWTService(redisMock.object())

    const result = jwtService.validate(jwtToken.accessToken)

    redisMock.verify(instance => instance.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()), Times.Never())
    redisMock.verify(instance => instance.get(It.IsAny<string>()), Times.Never())
    redisMock.verify(instance => instance.delete(It.IsAny<string>()), Times.Never())

    expect(result.isSuccess).to.equal(true)
  })

  step('Must be refresh jwt with success', async () => {
    const redisMock = new Mock<IRedisCli>()
      .setup(i => i.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()))
      .returns(Promise.resolve())
      .setup(i => i.get(jwtToken.refreshToken as string))
      .returns(Promise.resolve(JSON.stringify({anyValue: 123})))
      .setup(i => i.delete(It.IsAny<string>()))
      .returns(Promise.resolve())

    const jwtService = new JWTService(redisMock.object())

    const result = await jwtService.refresh(jwtToken.refreshToken)

    expect(result.isSuccess).to.equal(true)

    const newJwtToken = result.getValue() as JWTToken

    redisMock.verify(instance => instance.set(It.IsAny<string>(), It.IsAny<any>(), It.IsAny<number>()), Times.Once())
    redisMock.verify(instance => instance.get(It.IsAny<string>()), Times.Once())
    redisMock.verify(instance => instance.delete(It.IsAny<string>()), Times.Once())

    expect(newJwtToken).keys('accessToken', 'refreshToken', 'expiresIn')

    const decoded = jwt.verify(newJwtToken.accessToken, process.env.JWT_SECRET as string) as JwtPayload

    expect((decoded.exp as number) - (decoded.iat as number)).to.equal(newJwtToken.expiresIn / 1000)
    expect(decoded.data.anyValue).to.equal(123)
  })
})
