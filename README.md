## Description

API para conversão de moedas desenolvido utilizando a técnica de TDD com as tecnologias: NestJS, Typescript, Mongodb.

## Endpoints

### Currency exchange

```bash
GET
http://localhost/exchange/?from=USD&to=BRL&amount=1
```

### Create Currency

```bash
POST
http://localhost/currencies/
Put values in body:
currency=BRL
value=0.2
```

### Update Currency Value

```bash
PATCH
http://localhost/currencies/BRL/value
Put value in body:
value=0.22
```

### Delete Currency

```bash
DELETE
http://localhost/currencies/BRL
```

## License

Nest is [MIT licensed](LICENSE).