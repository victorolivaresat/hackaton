---
applyTo: "src/modules/**/domain/**/*.ts"
---

# Copilot Instructions — Entidades desde BD existente (TypeORM + Postgres)

## Alcance
Reglas **exclusivas** para crear y mantener entidades TypeORM. No definas servicios, controladores, DTOs, mappers ni repositorios aquí.  
Los módulos deben **referenciar** estas reglas cuando creen entidades.

## Contexto
- La BD y las tablas **ya existen** (sin migraciones).
- Las entidades deben reflejar exactamente el DDL (nombres `snake_case`, tipos, nulabilidad, FKs, índices).

## Reglas de mapeo (Postgres → TypeORM)
- PK numérica: `@PrimaryGeneratedColumn()` (o `'increment'` si es necesario).
- `varchar(n)` → `@Column({ type: 'varchar', length: n })`
- `text` → `@Column('text')`
- `integer` → `@Column({ type: 'int' })`
- `bigint` → `@Column({ type: 'bigint' })`
- `smallint` → `@Column({ type: 'smallint' })`
- `numeric(p,s)` → `@Column({ type: 'numeric', precision: p, scale: s })` (**usar `string` en TS**)
- `boolean` → `@Column({ type: 'boolean' })`
- `timestamp/timestamptz` → `@Column({ type: 'timestamp'|'timestamptz' })`
- `date` → `@Column({ type: 'date' })`
- `jsonb` → `@Column({ type: 'jsonb' })`
- `bytea` → `@Column({ type: 'bytea' })`
- `uuid` → `@Column('uuid')` (**no** como PK salvo que la BD lo use)

## Convenciones
- `@Entity({ name: '<tabla_snake>' })` **con `name` explícito**.
- Todas las columnas con `{ name: '<snake_case>' }` (coincidir con DDL).
- Timestamps si existen:  
  `@CreateDateColumn({ name: 'created_at' })`  
  `@UpdateDateColumn({ name: 'updated_at' })`  
  `@DeleteDateColumn({ name: 'deleted_at', nullable: true })`
- Índices únicos: `@Index('ux_<tabla>_<col>', ['<prop>'], { unique: true })`
- FKs: `@ManyToOne` + `@JoinColumn({ name: '<fk_column>' })` y su inversa `@OneToMany`.

## Plantilla mínima
```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';

@Entity({ name: '<table_name>' })
export class <PascalEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: '<snake_col>', type: '<pg_type>', length: <n?>, nullable: <true|false>, default: <valor?> })
  <camelProp>: <tsType>;

  // @Index('ux_<table_name>_<snake_col>', ['<camelProp>'], { unique: true })

  // @ManyToOne(() => OtraEntidad, (e) => e.items)
  // @JoinColumn({ name: '<fk_column>' })
  // otra?: OtraEntidad;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
```

## Flujo al crear/actualizar entidades
1) Copiar el DDL (`CREATE TABLE` + `ALTER TABLE ... FK/Índices`).  
2) Generar la clase `@Entity` con mapeo 1:1.  
3) Añadir índices (`@Index`) y relaciones con `@JoinColumn`.  
4) Exportar en `src/entities/index.ts`.  
5) Registrar en `TypeOrmModule.forFeature([...])` del módulo y en `getDatabaseConfig().entities`.

## Checklist
- PK con `@PrimaryGeneratedColumn()` (o `'increment'`).  
- `{ name: '<snake_case>' }` fiel al DDL.  
- Tipos Postgres correctos (especialmente `numeric`, `timestamptz`, `jsonb`).  
- Nullability/defaults replicados.  
- Índices y FKs declarados.  
- Export + registro en TypeORM hechos.
