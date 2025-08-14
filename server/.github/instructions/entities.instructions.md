---
applyTo: "src/modules/**/domain/**/*.ts"
---

# Copilot Instructions — Entidades desde BD existente (TypeORM + Postgres)

## Contexto
- **No usaremos migraciones** en la hackatón. La BD y las tablas ya existen.
- Las entidades deben **reflejar exactamente** el esquema de la BD (nombres de columnas `snake_case`, tipos, nulabilidad, claves foráneas e índices).
- **Clave primaria**: usar `@PrimaryGeneratedColumn()` (o `@PrimaryGeneratedColumn('increment')` en Postgres). Evitar `uuid` si la BD no lo usa.
- Agregar cada entidad nueva al **barrel** `src/entities/index.ts` y registrarla en `TypeOrmModule.forFeature([...])` del módulo correspondiente y en `getDatabaseConfig().entities`.

## Reglas de mapeo (Postgres → TypeORM)
- `uuid` → `@Column('uuid')` (pero **no** para PK aquí).
- `serial`/`bigserial` → `@PrimaryGeneratedColumn()` (o `'increment'`).
- `varchar(n)` → `@Column({ type: 'varchar', length: n })`.
- `text` → `@Column('text')`.
- `int2`/`smallint` → `@Column({ type: 'smallint' })`.
- `int4`/`integer` → `@Column({ type: 'int' })`.
- `int8`/`bigint` → `@Column({ type: 'bigint' })`.
- `numeric(p,s)` → `@Column({ type: 'numeric', precision: p, scale: s })`.
- `bool` → `@Column({ type: 'boolean' })`.
- `timestamptz` → `@Column({ type: 'timestamptz' })`.
- `timestamp` → `@Column({ type: 'timestamp' })`.
- `date` → `@Column({ type: 'date' })`.
- `jsonb` → `@Column({ type: 'jsonb' })`.
- `bytea` → `@Column({ type: 'bytea' })`.

## Convenciones
- `@Entity({ name: '<tabla>' })` siempre con **name** explícito.
- Cada columna debe usar `@Column({ name: '<snake_case>' })` salvo PK y columns especiales.
- Timestamps: `@CreateDateColumn({ name: 'created_at' })`, `@UpdateDateColumn({ name: 'updated_at' })`, `@DeleteDateColumn({ name: 'deleted_at' })` cuando existan.
- Campos opcionales: `nullable: true` y tipo TS con `?`.
- Índices únicos: `@Index('ux_<tabla>_<col>', ['<prop>'], { unique: true })`.
- FKs: `@ManyToOne()` + `@JoinColumn({ name: '<fk_column>' })`. Para la inversa, `@OneToMany()`.

## Plantilla de entidad mínima
Usa esta forma **exacta** y reemplaza por tus columnas:

```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';

@Entity({ name: '<table_name>' })
export class <PascalEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: '<snake_col>', type: '<pg_type>', length: <n?>, nullable: <true|false>, default: <valor?> })
  <camelProp>: <tsType>;

  // Ejemplo índice único
  // @Index('ux_<table_name>_<snake_col>', ['<camelProp>'], { unique: true })

  // FK ejemplo
  // @ManyToOne(() => OtraEntidad, (e) => e.<collectionProp>)
  // @JoinColumn({ name: '<fk_column>' })
  // otra?: OtraEntidad;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
