On this pageRegistries

# JSON Schema

💎

**New** — Zod 4 introduces a new feature: native [JSON Schema](https://json-schema.org/) conversion. JSON Schema is a standard for describing the structure of JSON (with JSON). It's widely used in [OpenAPI](https://www.openapis.org/) definitions and defining [structured outputs](https://platform.openai.com/docs/guides/structured-outputs?api-mode=chat) for AI.

To convert a Zod schema to JSON Schema, use the

```
z.toJSONSchema()
```

function.

```
import * as z from "zod";
const schema = z.object({
  name: z.string(),
  age: z.number(),
});
z.toJSONSchema(schema)
// => {
//   type: 'object',
//   properties: { name: { type: 'string' }, age: { type: 'number' } },
//   required: [ 'name', 'age' ],
//   additionalProperties: false,
// }
```

All schema & checks are converted to their closest JSON Schema equivalent. Some types have no analog and cannot be reasonably represented. See the [

```
unrepresentable
```

](#unrepresentable) section below for more information on handling these cases.

```
z.bigint(); // ❌
z.int64(); // ❌
z.symbol(); // ❌
z.void(); // ❌
z.date(); // ❌
z.map(); // ❌
z.set(); // ❌
z.transform(); // ❌
z.nan(); // ❌
z.custom(); // ❌
```

## [String formats](https://zod.dev/json-schema?id=string-formats)

Zod converts the following schema types to the equivalent JSON Schema

```
format
```

:

```
// Supported via `format`
z.email(); // => { type: "string", format: "email" }
z.iso.datetime(); // => { type: "string", format: "date-time" }
z.iso.date(); // => { type: "string", format: "date" }
z.iso.time(); // => { type: "string", format: "time" }
z.iso.duration(); // => { type: "string", format: "duration" }
z.ipv4(); // => { type: "string", format: "ipv4" }
z.ipv6(); // => { type: "string", format: "ipv6" }
z.uuid(); // => { type: "string", format: "uuid" }
z.guid(); // => { type: "string", format: "uuid" }
z.url(); // => { type: "string", format: "uri" }
```

These schemas are supported via

```
contentEncoding
```

:

```
z.base64(); // => { type: "string", contentEncoding: "base64" }
```

All other string formats are supported via

```
pattern
```

:

```
z.base64url();
z.cuid();
z.emoji();
z.nanoid();
z.cuid2();
z.ulid();
z.cidrv4();
z.cidrv6();
```

## [Numeric types](https://zod.dev/json-schema?id=numeric-types)

Zod converts the following numeric types to JSON Schema:

```
// number
z.number(); // => { type: "number" }
z.float32(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }
z.float64(); // => { type: "number", exclusiveMinimum: ..., exclusiveMaximum: ... }
// integer
z.int(); // => { type: "integer" }
z.int32(); // => { type: "integer", exclusiveMinimum: ..., exclusiveMaximum: ... }
```

## [Object schemas](https://zod.dev/json-schema?id=object-schemas)

By default,

```
z.object()
```

schemas contain

```
additionalProperties: "false"
```

. This is an accurate representation of Zod's default behavior, as plain

```
z.object()
```

schema strip additional properties.

```
import * as z from "zod";
const schema = z.object({
  name: z.string(),
  age: z.number(),
});
z.toJSONSchema(schema)
// => {
//   type: 'object',
//   properties: { name: { type: 'string' }, age: { type: 'number' } },
//   required: [ 'name', 'age' ],
//   additionalProperties: false,
// }
```

When converting to JSON Schema in

```
"input"
```

mode,

```
additionalProperties
```

is not set. See the [

```
io
```

docs](#io) for more information.

```
import * as z from "zod";
const schema = z.object({
  name: z.string(),
  age: z.number(),
});
z.toJSONSchema(schema, { io: "input" });
// => {
//   type: 'object',
//   properties: { name: { type: 'string' }, age: { type: 'number' } },
//   required: [ 'name', 'age' ],
// }
```

By contrast:

- ```
  z.looseObject()
  ```
  will _never_ set
  ```
  additionalProperties: false
  ```
- ```
  z.strictObject()
  ```
  will _always_ set
  ```
  additionalProperties: false
  ```

## [File schemas](https://zod.dev/json-schema?id=file-schemas)

Zod converts

```
z.file()
```

to the following OpenAPI-friendly schema:

```
z.file();
// => { type: "string", format: "binary", contentEncoding: "binary" }
```

Size and MIME checks are also represented:

```
z.file().min(1).max(1024 * 1024).mime("image/png");
// => {
//   type: "string",
//   format: "binary",
//   contentEncoding: "binary",
//   contentMediaType: "image/png",
//   minLength: 1,
//   maxLength: 1048576,
// }
```

## [Nullability](https://zod.dev/json-schema?id=nullability)

Zod converts both

```
undefined
```

/

```
null
```

to

```
{ type: "null" }
```

in JSON Schema.

```
z.null();
// => { type: "null" }
z.undefined();
// => { type: "null" }
```

Similarly,

```
nullable
```

is represented via a union with

```
null
```

::

```
z.nullable(z.string());
// => { oneOf: [{ type: "string" }, { type: "null" }] }
```

Optional schemas are represented as-is, though they are decorated with an

```
optional
```

annotation.

```
z.optional(z.string());
// => { type: "string" }
```

## [Configuration](https://zod.dev/json-schema?id=configuration)

A second argument can be used to customize the conversion logic.

```
z.toJSONSchema(schema, {
  // ...params
})
```

Below is a quick reference for each supported parameter. Each one is explained in more detail below.

```
interface ToJSONSchemaParams {
  /** The JSON Schema version to target.
   * - `"draft-2020-12"` — Default. JSON Schema Draft 2020-12
   * - `"draft-7"` — JSON Schema Draft 7
   * - `"draft-4"` — JSON Schema Draft 4 */
  target?: "draft-4" | "draft-7" | "draft-2020-12";
  /** A registry used to look up metadata for each schema.
   * Any schema with an `id` property will be extracted as a $def. */
  metadata?: $ZodRegistry<Record<string, any>>;
  /** How to handle unrepresentable types.
   * - `"throw"` — Default. Unrepresentable types throw an error
   * - `"any"` — Unrepresentable types become `{}` */
  unrepresentable?: "throw" | "any";
  /** How to handle cycles.
   * - `"ref"` — Default. Cycles will be broken using $defs
   * - `"throw"` — Cycles will throw an error if encountered */
  cycles?: "ref" | "throw";
  /* How to handle reused schemas.
   * - `"inline"` — Default. Reused schemas will be inlined
   * - `"ref"` — Reused schemas will be extracted as $defs */
  reused?: "ref" | "inline";
  /** A function used to convert `id` values to URIs to be used in *external* $refs.
   *
   * Default is `(id) => id`.
   */
  uri?: (id: string) => string;
}
```

### [

```
target
```

](https://zod.dev/json-schema?id=target)

To set the target JSON Schema version, use the

```
target
```

parameter. By default, Zod will target Draft 2020-12.

```
z.toJSONSchema(schema, { target: "draft-7" });
z.toJSONSchema(schema, { target: "draft-2020-12" });
z.toJSONSchema(schema, { target: "draft-4" });
```

### [

```
metadata
```

](https://zod.dev/json-schema?id=metadata)

If you haven't already, read through the [Metadata and registries](https://zod.dev/metadata) page for context on storing metadata in Zod.

In Zod, metadata is stored in registries. Zod exports a global registry

```
z.globalRegistry
```

that can be used to store common metadata fields like

```
id
```

,

```
title
```

,

```
description
```

, and

```
examples
```

.

ZodZod Mini

```
import * as z from "zod";
// `.meta()` is a convenience method for registering a schema in `z.globalRegistry`
const emailSchema = z.string().meta({
  title: "Email address",
  description: "Your email address",
});
z.toJSONSchema(emailSchema);
// => { type: "string", title: "Email address", description: "Your email address", ... }
```

All metadata fields get copied into the resulting JSON Schema.

```
const schema = z.string().meta({
  whatever: 1234
});
z.toJSONSchema(schema);
// => { type: "string", whatever: 1234 }
```

### [

```
unrepresentable
```

](https://zod.dev/json-schema?id=unrepresentable)

The following APIs are not representable in JSON Schema. By default, Zod will throw an error if they are encountered. It is unsound to attempt a conversion to JSON Schema; you should modify your schemas as they have no equivalent in JSON. An error will be thrown if any of these are encountered.

```
z.bigint(); // ❌
z.int64(); // ❌
z.symbol(); // ❌
z.void(); // ❌
z.date(); // ❌
z.map(); // ❌
z.set(); // ❌
z.transform(); // ❌
z.nan(); // ❌
z.custom(); // ❌
```

By default, Zod will throw an error if any of these are encountered.

```
z.toJSONSchema(z.bigint());
// => throws Error
```

You can change this behavior by setting the

```
unrepresentable
```

option to

```
"any"
```

. This will convert any unrepresentable types to

```
{}
```

(the equivalent of

```
unknown
```

in JSON Schema).

```
z.toJSONSchema(z.bigint(), { unrepresentable: "any" });
// => {}
```

### [

```
cycles
```

](https://zod.dev/json-schema?id=cycles)

How to handle cycles. If a cycle is encountered as

```
z.toJSONSchema()
```

traverses the schema, it will be represented using

```
$ref
```

.

```
const User = z.object({
  name: z.string(),
  get friend() {
    return User;
  },
});
z.toJSONSchema(User);
// => {
//   type: 'object',
//   properties: { name: { type: 'string' }, friend: { '$ref': '#' } },
//   required: [ 'name', 'friend' ],
//   additionalProperties: false,
// }
```

If instead you want to throw an error, set the

```
cycles
```

option to

```
"throw"
```

.

```
z.toJSONSchema(User, { cycles: "throw" });
// => throws Error
```

### [

```
reused
```

](https://zod.dev/json-schema?id=reused)

How to handle schemas that occur multiple times in the same schema. By default, Zod will inline these schemas.

```
const name = z.string();
const User = z.object({
  firstName: name,
  lastName: name,
});
z.toJSONSchema(User);
// => {
//   type: 'object',
//   properties: {
//     firstName: { type: 'string' },
//     lastName: { type: 'string' }
//   },
//   required: [ 'firstName', 'lastName' ],
//   additionalProperties: false,
// }
```

Instead you can set the

```
reused
```

option to

```
"ref"
```

to extract these schemas into

```
$defs
```

.

```
z.toJSONSchema(User, { reused: "ref" });
// => {
//   type: 'object',
//   properties: {
//     firstName: { '$ref': '#/$defs/__schema0' },
//     lastName: { '$ref': '#/$defs/__schema0' }
//   },
//   required: [ 'firstName', 'lastName' ],
//   additionalProperties: false,
//   '$defs': { __schema0: { type: 'string' } }
// }
```

### [

```
override
```

](https://zod.dev/json-schema?id=override)

To define some custom override logic, use

```
override
```

. The provided callback has access to the original Zod schema and the default JSON Schema. \_This function should directly modify

```
ctx.jsonSchema
```

.\_

```
const mySchema = /* ... */
z.toJSONSchema(mySchema, {
  override: (ctx)=>{
    ctx.zodSchema; // the original Zod schema
    ctx.jsonSchema; // the default JSON Schema
    // directly modify
    ctx.jsonSchema.whatever = "sup";
  }
});
```

Note that unrepresentable types will throw an

```
Error
```

before this functions is called. If you are trying to define custom behavior for an unrepresentable type, you'll need to use set the

```
unrepresentable: "any"
```

alongside

```
override
```

.

```
// support z.date() as ISO datetime strings
const result = z.toJSONSchema(z.date(), {
  unrepresentable: "any",
  override: (ctx) => {
    const def = ctx.zodSchema._zod.def;
    if(def.type ==="date"){
      ctx.jsonSchema.type = "string";
      ctx.jsonSchema.format = "date-time";
    }
  },
});
```

### [

```
io
```

](https://zod.dev/json-schema?id=io)

Some schema types have different input and output types, e.g.

```
ZodPipe
```

,

```
ZodDefault
```

, and coerced primitives. By default, the result of

```
z.toJSONSchema
```

represents the _output type_; use

```
"io": "input"
```

to extract the input type instead.

```
const mySchema = z.string().transform(val => val.length).pipe(z.number());
// ZodPipe
const jsonSchema = z.toJSONSchema(mySchema);
// => { type: "number" }
const jsonSchema = z.toJSONSchema(mySchema, { io: "input" });
// => { type: "string" }
```

## [Registries](https://zod.dev/json-schema?id=registries)

Passing a schema into

```
z.toJSONSchema()
```

will return a _self-contained_ JSON Schema.

In other cases, you may have a set of Zod schemas you'd like to represent using multiple interlinked JSON Schemas, perhaps to write to

```
.json
```

files and serve from a web server.

```
import * as z from "zod";
const User = z.object({
  name: z.string(),
  get posts(){
    return z.array(Post);
  }
});
const Post = z.object({
  title: z.string(),
  content: z.string(),
  get author(){
    return User;
  }
});
z.globalRegistry.add(User, {id: "User"});
z.globalRegistry.add(Post, {id: "Post"});
```

To achieve this, you can pass a [registry](https://zod.dev/metadata#registries) into

```
z.toJSONSchema()
```

.

**Important** — All schemas should have a registered

```
id
```

property in the registry! Any schemas without an

```
id
```

will be ignored.

```
z.toJSONSchema(z.globalRegistry);
// => {
//   schemas: {
//     User: {
//       id: 'User',
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         posts: { type: 'array', items: { '$ref': 'Post' } }
//       },
//       required: [ 'name', 'posts' ],
//       additionalProperties: false,
//     },
//     Post: {
//       id: 'Post',
//       type: 'object',
//       properties: {
//         title: { type: 'string' },
//         content: { type: 'string' },
//         author: { '$ref': 'User' }
//       },
//       required: [ 'title', 'content', 'author' ],
//       additionalProperties: false,
//     }
//   }
// }
```

By default, the

```
$ref
```

URIs are simple relative paths like

```
"User"
```

. To make these absolute URIs, use the

```
uri
```

option. This expects a function that converts an

```
id
```

to a fully-qualified URI.

```
z.toJSONSchema(z.globalRegistry, {
  uri: (id) => `https://example.com/${id}.json`
});
// => {
//   schemas: {
//     User: {
//       id: 'User',
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         posts: {
//           type: 'array',
//           items: { '$ref': 'https://example.com/Post.json' }
//         }
//       },
//       required: [ 'name', 'posts' ],
//       additionalProperties: false,
//     },
//     Post: {
//       id: 'Post',
//       type: 'object',
//       properties: {
//         title: { type: 'string' },
//         content: { type: 'string' },
//         author: { '$ref': 'https://example.com/User.json' }
//       },
//       required: [ 'title', 'content', 'author' ],
//       additionalProperties: false,
//     }
//   }
// }
```
