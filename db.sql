CREATE TABLE clientes (
	id SERIAL PRIMARY KEY NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(100) NOT NULL, 
	cpf VARCHAR(11) UNIQUE NOT NULL
)

SELECT * FROM clientes;
SELECT * FROM barbeiros;
SELECT * FROM gerenciamento;
SELECT * FROM servicos;


CREATE TABLE barbeiros (
	id SERIAL PRIMARY KEY NOT NULL,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(100) NOT NULL, 
	cpf VARCHAR(11) UNIQUE NOT NULL
)
DROP TABLE gerenciamento;
DROP TABLE barbeiros;

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome_servico VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    duracao INT NOT NULL
);

CREATE TABLE gerenciamento (
id SERIAL PRIMARY KEY, 
id_servicos INT NOT NULL,
id_barbeiros INT NOT NULL, 
id_clientes INT NOT NULL,
data DATE NOT NULL,
horario TIME NOT NULL,

FOREIGN KEY (id_servicos) REFERENCES servicos(id),
FOREIGN KEY (id_barbeiros) REFERENCES barbeiros(id),
FOREIGN KEY (id_clientes) REFERENCES clientes(id)
);


INSERT INTO clientes (nome, email, senha, cpf) VALUES 
('Nicole Borges', 'nicoleborges@gmail.com', 'nicborges23', '22587496320'),
('Fabricio Kurrle', 'fafakurrle@gmail.com', 'fafakurrle021', '88745201308'),
('Helio Vasconselhos', 'vasconselhoshelio@gmail.com', 'heliovasconselhos478', '78740201386')

INSERT INTO barbeiros (nome, email, senha, cpf) VALUES 
('Rogerio Lodi', 'rogeriolodi@gmail.com', 'bololo785', '58963201478'),
('Barbara Cascaes', 'barbaracascaes@gmail.com', 'cascaes52', '29775204308'),
('Victor da Silva', 'victorsilva@gmail.com', 'victorsilva542', '52003601986')

INSERT INTO servicos (nome_servico, preco, duracao) VALUES
('Corte de cabelo', 35.00, 40),
('Barba', 25.00, 30),
('Corte e barba', 55.00, 60)

INSERT INTO gerenciamento (id_servicos, id_barbeiros, id_clientes, data, horario) VALUES
(1, 1, 1, '2026-11-11', '08:00:00'),
(2, 2, 2, '2026-11-11', '09:00:00'),
(3, 1, 3, '2026-11-11', '10:00:00')