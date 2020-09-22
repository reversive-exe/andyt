# andyt
Andyt significa android disassembly tool, e é uma ferramenta para desmontar um aplicativo para código java e após isso, recompila-lo, possibilitando fazer edições precisas.
> :warning:  A versão atual pode não apresentar tudo oque o andyt promete, pois está em fase de desenvolvimento, verifique a [lista TODO](#todo).

[![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)](https://github.com/reversive-exe/andyt/)

## Requisitos
- Nodejs => https://nodejs.org/en/

## Setup
> Clone o repositório do andyt

```shell
$ git clone https://github.com/reversive-exe/andyt.git
```

> Dentro da pasta do repositório instale as dependências
```shell
$ npm install
```

## Uso
- Na pasta source coloque apenas 1 arquivo.java que deseja transformar em .smali
> Abra um terminal na pasta e inicie o index.js
```shell
$ node index.js
```
- Após isso o arquivo.smali estará na pasta out

## TODO
- [x] Transpilar java para smali (instável)
- [ ] Transpilar smali para java
- [ ] Compilar smali para apk
- [ ] Decompilar apk
