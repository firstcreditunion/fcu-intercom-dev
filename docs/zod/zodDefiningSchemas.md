Defining schemas

](https://zod.dev/api)[

Customizing errors

](https://zod.dev/error-customization)[

Formatting errors

](https://zod.dev/error-formatting)[

Metadata and registries

New

](https://zod.dev/metadata)[

JSON Schema

New

](https://zod.dev/json-schema)[

Ecosystem

](https://zod.dev/ecosystem)[

For library authors

](https://zod.dev/library-authors)

Packages

[

Zod

](https://zod.dev/packages/zod)[

Zod Mini

New

](https://zod.dev/packages/mini)[

Zod Core

New

](https://zod.dev/packages/core)

[](https://github.com/colinhacks/zod)

On this pageFunctions

# Defining schemas

To validate data, you must first define a _schema_. Schemas represent _types_, from simple primitive values to complex nested objects and arrays.

## [Primitives](https://zod.dev/api?id=primitives)

```
import * as z from "zod";
// primitive types
z.string();
z.number();
z.bigint();
z.boolean();
z.symbol();
z.undefined();
z.null();
```

### [Coercion](https://zod.dev/api?id=coercion)

To coerce input data to the appropriate type, use

```
z.coerce
```

instead:

```
z.coerce.string();    // String(input)
z.coerce.number();    // Number(input)
z.coerce.boolean();   // Boolean(input)
z.coerce.bigint();    // BigInt(input)
```

The coerced variant of these schemas attempts to convert the input value to the appropriate type.

```
const schema = z.coerce.string();
schema.parse("tuna");    // => "tuna"
schema.parse(42);        // => "42"
schema.parse(true);      // => "true"
schema.parse(null);      // => "null"
```

The input type of these coerced schemas is

```
unknown
```

by default. To specify a more specific input type, pass a generic parameter:

```
const A = z.coerce.number();
type AInput = z.infer<typeof A>; // => number
const B = z.coerce.number<number>();
type BInput = z.infer<typeof B>; // => number
```

### How coercion works in Zod

## [Literals](https://zod.dev/api?id=literals)

Literal schemas represent a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), like

```
"hello world"
```

or

```
5
```

.

```
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n);
const tru = z.literal(true);
```

To represent the JavaScript literals

```
null
```

and

```
undefined
```

:

```
z.null();
z.undefined();
z.void(); // equivalent to z.undefined()
```

To allow multiple literal values:

```
const colors = z.literal(["red", "green", "blue"]);
colors.parse("green"); // ✅
colors.parse("yellow"); // ❌
```

To extract the set of allowed values from a literal schema:

ZodZod Mini

```
colors.values; // => Set<"red" | "green" | "blue">
```

## [Strings](https://zod.dev/api?id=strings)

Zod provides a handful of built-in string validation and transform APIs. To perform some common string validations:

ZodZod Mini

```
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().regex(/^[a-z]+$/);
z.string().startsWith("aaa");
z.string().endsWith("zzz");
z.string().includes("---");
z.string().uppercase();
z.string().lowercase();
```

To perform some simple string transforms:

ZodZod Mini

```
z.string().trim(); // trim whitespace
z.string().toLowerCase(); // toLowerCase
z.string().toUpperCase(); // toUpperCase
z.string().normalize(); // normalize unicode characters
```

## [String formats](https://zod.dev/api?id=string-formats)

To validate against some common string formats:

```
z.email();
z.uuid();
z.url();
z.hostname();
z.emoji();         // validates a single emoji character
z.base64();
z.base64url();
z.jwt();
z.nanoid();
z.cuid();
z.cuid2();
z.ulid();
z.ipv4();
z.ipv6();
z.cidrv4();        // ipv4 CIDR block
z.cidrv6();        // ipv6 CIDR block
z.iso.date();
z.iso.time();
z.iso.datetime();
z.iso.duration();
```

### [Emails](https://zod.dev/api?id=emails)

To validate email addresses:

```
z.email();
```

By default, Zod uses a comparatively strict email regex designed to validate normal email addresses containing common characters. It's roughly equivalent to the rules enforced by Gmail. To learn more about this regex, refer to [this post](https://colinhacks.com/essays/reasonable-email-regex).

```
/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
```

To customize the email validation behavior, you can pass a custom regular expression to the

```
pattern
```

param.

```
z.email({ pattern: /your regex here/ });
```

Zod exports several useful regexes you could use.

```
// Zod's default email regex
z.email();
z.email({ pattern: z.regexes.email }); // equivalent
// the regex used by browsers to validate input[type=email] fields
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
z.email({ pattern: z.regexes.html5Email });
// the classic emailregex.com regex (RFC 5322)
z.email({ pattern: z.regexes.rfc5322Email });
// a loose regex that allows Unicode (good for intl emails)
z.email({ pattern: z.regexes.unicodeEmail });
```

### [UUIDs](https://zod.dev/api?id=uuids)

To validate UUIDs:

```
z.uuid();
```

To specify a particular UUID version:

```
// supports "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"
z.uuid({ version: "v4" });
// for convenience
z.uuidv4();
z.uuidv6();
z.uuidv7();
```

The RFC 9562/4122 UUID spec requires the first two bits of byte 8 to be

```
10
```

. Other UUID-like identifiers do not enforce this constraint. To validate any UUID-like identifier:

```
z.guid();
```

### [URLs](https://zod.dev/api?id=urls)

To validate any WHATWG-compatible URL:

```
const schema = z.url();
schema.parse("https://example.com"); // ✅
schema.parse("http://localhost"); // ✅
schema.parse("mailto:noreply@zod.dev"); // ✅
```

As you can see this is quite permissive. Internally this uses the

```
new URL()
```

constructor to validate inputs; this behavior may differ across platforms and runtimes but it's the mostly rigorous way to validate URIs/URLs on any given JS runtime/engine.

To validate the hostname against a specific regex:

```
const schema = z.url({ hostname: /^example\.com$/ });
schema.parse("https://example.com"); // ✅
schema.parse("https://zombo.com"); // ❌
```

To validate the protocol against a specific regex, use the

```
protocol
```

param.

```
const schema = z.url({ protocol: /^https$/ });
schema.parse("https://example.com"); // ✅
schema.parse("http://example.com"); // ❌
```

**Web URLs** — In many cases, you'll want to validate Web URLs specifically. Here's the recommended schema for doing so:

```
const httpUrl = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain
});
```

This restricts the protocol to

```
http
```

/

```
https
```

and ensures the hostname is a valid domain name with the

```
z.regexes.domain
```

regular expression:

```
/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
```

To normalize URLs, use the

```
normalize
```

flag. This will overwrite the input value with the [normalized URL](https://chatgpt.com/share/6881547f-bebc-800f-9093-f5981e277c2c) returned by

```
new URL()
```

.

```
new URL("HTTP://ExAmPle.com:80/./a/../b?X=1#f oo").href
// => "http://example.com/b?X=1#f%20oo"
```

### [ISO datetimes](https://zod.dev/api?id=iso-datetimes)

As you may have noticed, Zod string includes a few date/time related validations. These validations are regular expression based, so they are not as strict as a full date/time library. However, they are very convenient for validating user input.

The

```
z.iso.datetime()
```

method enforces ISO 8601; by default, no timezone offsets are allowed:

```
const datetime = z.iso.datetime();
datetime.parse("2020-01-01T06:15:00Z"); // ✅
datetime.parse("2020-01-01T06:15:00.123Z"); // ✅
datetime.parse("2020-01-01T06:15:00.123456Z"); // ✅ (arbitrary precision)
datetime.parse("2020-01-01T06:15:00+02:00"); // ❌ (offsets not allowed)
datetime.parse("2020-01-01T06:15:00"); // ❌ (local not allowed)
```

To allow timezone offsets:

```
const datetime = z.iso.datetime({ offset: true });
// allows timezone offsets
datetime.parse("2020-01-01T06:15:00+02:00"); // ✅
// basic offsets not allowed
datetime.parse("2020-01-01T06:15:00+02");    // ❌
datetime.parse("2020-01-01T06:15:00+0200");  // ❌
// Z is still supported
datetime.parse("2020-01-01T06:15:00Z"); // ✅
```

To allow unqualified (timezone-less) datetimes:

```
const schema = z.iso.datetime({ local: true });
schema.parse("2020-01-01T06:15:01"); // ✅
schema.parse("2020-01-01T06:15"); // ✅ seconds optional
```

To constrain the allowable time

```
precision
```

. By default, seconds are optional and arbitrary sub-second precision is allowed.

```
const a = z.iso.datetime();
a.parse("2020-01-01T06:15Z"); // ✅
a.parse("2020-01-01T06:15:00Z"); // ✅
a.parse("2020-01-01T06:15:00.123Z"); // ✅
const b = z.iso.datetime({ precision: -1 }); // minute precision (no seconds)
b.parse("2020-01-01T06:15Z"); // ✅
b.parse("2020-01-01T06:15:00Z"); // ❌
b.parse("2020-01-01T06:15:00.123Z"); // ❌
const c = z.iso.datetime({ precision: 0 }); // second precision only
c.parse("2020-01-01T06:15Z"); // ❌
c.parse("2020-01-01T06:15:00Z"); // ✅
c.parse("2020-01-01T06:15:00.123Z"); // ❌
const d = z.iso.datetime({ precision: 3 }); // millisecond precision only
d.parse("2020-01-01T06:15Z"); // ❌
d.parse("2020-01-01T06:15:00Z"); // ❌
d.parse("2020-01-01T06:15:00.123Z"); // ✅
```

### [ISO dates](https://zod.dev/api?id=iso-dates)

The

```
z.iso.date()
```

method validates strings in the format

```
YYYY-MM-DD
```

.

```
const date = z.iso.date();
date.parse("2020-01-01"); // ✅
date.parse("2020-1-1"); // ❌
date.parse("2020-01-32"); // ❌
```

### [ISO times](https://zod.dev/api?id=iso-times)

The

```
z.iso.time()
```

method validates strings in the format

```
HH:MM[:SS[.s+]]
```

. By default seconds are optional, as are sub-second deciams.

```
const time = z.iso.time();
time.parse("03:15"); // ✅
time.parse("03:15:00"); // ✅
time.parse("03:15:00.9999999"); // ✅ (arbitrary precision)
```

No offsets of any kind are allowed.

```
time.parse("03:15:00Z"); // ❌ (no `Z` allowed)
time.parse("03:15:00+02:00"); // ❌ (no offsets allowed)
```

Use the

```
precision
```

parameter to constrain the allowable decimal precision.

```
z.iso.time({ precision: -1 }); // HH:MM (minute precision)
z.iso.time({ precision: 0 }); // HH:MM:SS (second precision)
z.iso.time({ precision: 1 }); // HH:MM:SS.s (decisecond precision)
z.iso.time({ precision: 2 }); // HH:MM:SS.ss (centisecond precision)
z.iso.time({ precision: 3 }); // HH:MM:SS.sss (millisecond precision)
```

### [IP addresses](https://zod.dev/api?id=ip-addresses)

```
const ipv4 = z.ipv4();
ipv4.parse("192.168.0.0"); // ✅
const ipv6 = z.ipv6();
ipv6.parse("2001:db8:85a3::8a2e:370:7334"); // ✅
```

### [IP blocks (CIDR)](https://zod.dev/api?id=ip-blocks-cidr)

Validate IP address ranges specified with [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

```
const cidrv4 = z.string().cidrv4();
cidrv4.parse("192.168.0.0/24"); // ✅
const cidrv6 = z.string().cidrv6();
cidrv6.parse("2001:db8::/32"); // ✅
```

### [JWTs](https://zod.dev/api?id=jwts)

Validate [JSON Web Tokens](https://jwt.io/).

```
z.jwt();
z.jwt({ alg: "HS256" });
```

## [Template literals](https://zod.dev/api?id=template-literals)

**New in Zod 4**

To define a template literal schema:

```
const schema = z.templateLiteral([ "hello, ", z.string(), "!" ]);
// `hello, ${string}!`
```

The

```
z.templateLiteral
```

API can handle any number of string literals (e.g.

```
"hello"
```

) and schemas. Any schema with an inferred type that's assignable to

```
string | number | bigint | boolean | null | undefined
```

can be passed.

```
z.templateLiteral([ "hi there" ]);
// `hi there`
z.templateLiteral([ "email: ", z.string() ]);
// `email: ${string}`
z.templateLiteral([ "high", z.literal(5) ]);
// `high5`
z.templateLiteral([ z.nullable(z.literal("grassy")) ]);
// `grassy` | `null`
z.templateLiteral([ z.number(), z.enum(["px", "em", "rem"]) ]);
// `${number}px` | `${number}em` | `${number}rem`
```

## [Numbers](https://zod.dev/api?id=numbers)

Use

```
z.number()
```

to validate numbers. It allows any finite number.

```
const schema = z.number();
schema.parse(3.14);      // ✅
schema.parse(NaN);       // ❌
schema.parse(Infinity);  // ❌
```

Zod implements a handful of number-specific validations:

ZodZod Mini

```
z.number().gt(5);
z.number().gte(5);                     // alias .min(5)
z.number().lt(5);
z.number().lte(5);                     // alias .max(5)
z.number().positive();
z.number().nonnegative();
z.number().negative();
z.number().nonpositive();
z.number().multipleOf(5);              // alias .step(5)
```

If (for some reason) you want to validate

```
NaN
```

, use

```
z.nan()
```

.

```
z.nan().parse(NaN);              // ✅
z.nan().parse("anything else");  // ❌
```

## [Integers](https://zod.dev/api?id=integers)

To validate integers:

```
z.int();     // restricts to safe integer range
z.int32();   // restrict to int32 range
```

## [BigInts](https://zod.dev/api?id=bigints)

To validate BigInts:

```
z.bigint();
```

Zod includes a handful of bigint-specific validations.

ZodZod Mini

```
z.bigint().gt(5n);
z.bigint().gte(5n);                    // alias `.min(5n)`
z.bigint().lt(5n);
z.bigint().lte(5n);                    // alias `.max(5n)`
z.bigint().positive();
z.bigint().nonnegative();
z.bigint().negative();
z.bigint().nonpositive();
z.bigint().multipleOf(5n);             // alias `.step(5n)`
```

## [Booleans](https://zod.dev/api?id=booleans)

To validate boolean values:

```
z.boolean().parse(true); // => true
z.boolean().parse(false); // => false
```

## [Dates](https://zod.dev/api?id=dates)

Use

```
z.date()
```

to validate

```
Date
```

instances.

```
z.date().safeParse(new Date()); // success: true
z.date().safeParse("2022-01-12T06:15:00.000Z"); // success: false
```

To customize the error message:

```
z.date({
  error: issue => issue.input === undefined ? "Required" : "Invalid date"
});
```

Zod provides a handful of date-specific validations.

ZodZod Mini

```
z.date().min(new Date("1900-01-01"), { error: "Too old!" });
z.date().max(new Date(), { error: "Too young!" });
```

## [Enums](https://zod.dev/api?id=enums)

Use

```
z.enum
```

to validate inputs against a fixed set of allowable _string_ values.

```
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
FishEnum.parse("Salmon"); // => "Salmon"
FishEnum.parse("Swordfish"); // => ❌
```

Careful — If you declare your string array as a variable, Zod won't be able to properly infer the exact values of each element.

```
const fish = ["Salmon", "Tuna", "Trout"];
const FishEnum = z.enum(fish);
type FishEnum = z.infer<typeof FishEnum>; // string
```

To fix this, always pass the array directly into the

```
z.enum()
```

function, or use [

```
as const
```

](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions).

```
const fish = ["Salmon", "Tuna", "Trout"] as const;
const FishEnum = z.enum(fish);
type FishEnum = z.infer<typeof FishEnum>; // "Salmon" | "Tuna" | "Trout"
```

Enum-like object literals (

```
{ [key: string]: string | number }
```

) are supported.

```
const Fish = {
  Salmon: "Salmon",
  Tuna: "Tuna"
} as const
const FishEnum = z.enum(Fish)
FishEnum.parse("Salmon"); // => "Salmon"
FishEnum.parse("Swordfish"); // => ❌
```

You can also pass in an externally-declared TypeScript enum.

**Zod 4** — This replaces the

```
z.nativeEnum()
```

API in Zod 3.

Note that using TypeScript's

```
enum
```

keyword is [not recommended](https://www.totaltypescript.com/why-i-dont-like-typescript-enums).

```
enum Fish {
  Salmon = "Salmon",
  Tuna = "Tuna",
  Trout = "Trout",
}
const FishEnum = z.enum(Fish);
```

### [

```
.enum
```

](https://zod.dev/api?id=enum)

To extract the schema's values as an enum-like object:

ZodZod Mini

```
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
FishEnum.enum;
// => { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }
```

### [

```
.exclude()
```

](https://zod.dev/api?id=exclude)

To create a new enum schema, excluding certain values:

ZodZod Mini

```
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
const TunaOnly = FishEnum.exclude(["Salmon", "Trout"]);
```

### [

```
.extract()
```

](https://zod.dev/api?id=extract)

To create a new enum schema, extracting certain values:

ZodZod Mini

```
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
const SalmonAndTroutOnly = FishEnum.extract(["Salmon", "Trout"]);
```

## [Stringbools](https://zod.dev/api?id=stringbool)

**💎 New in Zod 4**

In some cases (e.g. parsing environment variables) it's valuable to parse certain string "boolish" values to a plain

```
boolean
```

value. To support this, Zod 4 introduces

```
z.stringbool()
```

:

```
const strbool = z.stringbool();
strbool.parse("true")         // => true
strbool.parse("1")            // => true
strbool.parse("yes")          // => true
strbool.parse("on")           // => true
strbool.parse("y")            // => true
strbool.parse("enabled")      // => true
strbool.parse("false");       // => false
strbool.parse("0");           // => false
strbool.parse("no");          // => false
strbool.parse("off");         // => false
strbool.parse("n");           // => false
strbool.parse("disabled");    // => false
strbool.parse(/* anything else */); // ZodError<[{ code: "invalid_value" }]>
```

To customize the truthy and falsy values:

```
// these are the defaults
z.stringbool({
  truthy: ["true", "1", "yes", "on", "y", "enabled"],
  falsy: ["false", "0", "no", "off", "n", "disabled"],
});
```

By default the schema is _case-insensitive_; all inputs are converted to lowercase before comparison to the

```
truthy
```

/

```
falsy
```

values. To make it case-sensitive:

```
z.stringbool({
  case: "sensitive"
});
```

## [Optionals](https://zod.dev/api?id=optionals)

To make a schema _optional_ (that is, to allow

```
undefined
```

inputs).

ZodZod Mini

```
z.optional(z.literal("yoda")); // or z.literal("yoda").optional()
```

This returns a

```
ZodOptional
```

instance that wraps the original schema. To extract the inner schema:

ZodZod Mini

```
optionalYoda.unwrap(); // ZodLiteral<"yoda">
```

## [Nullables](https://zod.dev/api?id=nullables)

To make a schema _nullable_ (that is, to allow

```
null
```

inputs).

ZodZod Mini

```
z.nullable(z.literal("yoda")); // or z.literal("yoda").nullable()
```

This returns a

```
ZodNullable
```

instance that wraps the original schema. To extract the inner schema:

ZodZod Mini

```
nullableYoda.unwrap(); // ZodLiteral<"yoda">
```

## [Nullish](https://zod.dev/api?id=nullish)

To make a schema _nullish_ (both optional and nullable):

ZodZod Mini

```
const nullishYoda = z.nullish(z.literal("yoda"));
```

Refer to the TypeScript manual for more about the concept of [nullish](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing).

## [Unknown](https://zod.dev/api?id=unknown)

Zod aims to mirror TypeScript's type system one-to-one. As such, Zod provides APIs to represent the following special types:

```
// allows any values
z.any(); // inferred type: `any`
z.unknown(); // inferred type: `unknown`
```

## [Never](https://zod.dev/api?id=never)

No value will pass validation.

```
z.never(); // inferred type: `never`
```

## [Objects](https://zod.dev/api?id=objects)

To define an object type:

```
  // all properties are required by default
  const Person = z.object({
    name: z.string(),
    age: z.number(),
  });
  type Person = z.infer<typeof Person>;
  // => { name: string; age: number; }
```

By default, all properties are required. To make certain properties optional:

ZodZod Mini

```
const Dog = z.object({
  name: z.string(),
  age: z.number().optional(),
});
Dog.parse({ name: "Yeller" }); // ✅
```

By default, unrecognized keys are _stripped_ from the parsed result:

```
Dog.parse({ name: "Yeller", extraKey: true });
// => { name: "Yeller" }
```

### [

```
z.strictObject
```

](https://zod.dev/api?id=zstrictobject)

To define a _strict_ schema that throws an error when unknown keys are found:

```
const StrictDog = z.strictObject({
  name: z.string(),
});
StrictDog.parse({ name: "Yeller", extraKey: true });
// ❌ throws
```

### [

```
z.looseObject
```

](https://zod.dev/api?id=zlooseobject)

To define a _loose_ schema that allows unknown keys to pass through:

```
const LooseDog = z.looseObject({
  name: z.string(),
});
Dog.parse({ name: "Yeller", extraKey: true });
// => { name: "Yeller", extraKey: true }
```

### [

```
.catchall()
```

](https://zod.dev/api?id=catchall)

To define a _catchall schema_ that will be used to validate any unrecognized keys:

ZodZod Mini

```
const DogWithStrings = z.object({
  name: z.string(),
  age: z.number().optional(),
}).catchall(z.string());
DogWithStrings.parse({ name: "Yeller", extraKey: "extraValue" }); // ✅
DogWithStrings.parse({ name: "Yeller", extraKey: 42 }); // ❌
```

### [

```
.shape
```

](https://zod.dev/api?id=shape)

To access the internal schemas:

ZodZod Mini

```
Dog.shape.name; // => string schema
Dog.shape.age; // => number schema
```

### [

```
.keyof()
```

](https://zod.dev/api?id=keyof)

To create a

```
ZodEnum
```

schema from the keys of an object schema:

ZodZod Mini

```
const keySchema = Dog.keyof();
// => ZodEnum<["name", "age"]>
```

### [

```
.extend()
```

](https://zod.dev/api?id=extend)

To add additional fields to an object schema:

ZodZod Mini

```
const DogWithBreed = Dog.extend({
  breed: z.string(),
});
```

This API can be used to overwrite existing fields! Be careful with this power! If the two schemas share keys, B will override A.

**Alternative: spread syntax** — You can alternatively avoid

```
.extend()
```

altogether by creating a new object schema entirely. This makes the strictness level of the resulting schema visually obvious.

```
const DogWithBreed = z.object({ // or z.strictObject() or z.looseObject()...
  ...Dog.shape,
  breed: z.string(),
});
```

You can also use this to merge multiple objects in one go.

```
const DogWithBreed = z.object({
  ...Animal.shape,
  ...Pet.shape,
  breed: z.string(),
});
```

This approach has a few advantages:

1.  It uses language-level features ([spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)) instead of library-specific APIs
2.  The same syntax works in Zod and Zod Mini
3.  It's more
    ```
    tsc
    ```
    \-efficient — the
    ```
    .extend()
    ```
    method can be expensive on large schemas, and due to [a TypeScript limitation](https://github.com/microsoft/TypeScript/pull/61505) it gets quadratically more expensive when calls are chained
4.  If you wish, you can change the strictness level of the resulting schema by using
    ```
    z.strictObject()
    ```
    or
    ```
    z.looseObject()
    ```

### [

```
.pick()
```

](https://zod.dev/api?id=pick)

Inspired by TypeScript's built-in

```
Pick
```

and

```
Omit
```

utility types, Zod provides dedicated APIs for picking and omitting certain keys from an object schema.

Starting from this initial schema:

```
const Recipe = z.object({
  title: z.string(),
  description: z.string().optional(),
  ingredients: z.array(z.string()),
});
// { title: string; description?: string | undefined; ingredients: string[] }
```

To pick certain keys:

ZodZod Mini

```
const JustTheTitle = Recipe.pick({ title: true });
```

### [

```
.omit()
```

](https://zod.dev/api?id=omit)

To omit certain keys:

ZodZod Mini

```
const RecipeNoId = Recipe.omit({ id: true });
```

### [

```
.partial()
```

](https://zod.dev/api?id=partial)

For convenience, Zod provides a dedicated API for making some or all properties optional, inspired by the built-in TypeScript utility type [

```
Partial
```

](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype).

To make all fields optional:

ZodZod Mini

```
const PartialRecipe = Recipe.partial();
// { title?: string | undefined; description?: string | undefined; ingredients?: string[] | undefined }
```

To make certain properties optional:

ZodZod Mini

```
const RecipeOptionalIngredients = Recipe.partial({
  ingredients: true,
});
// { title: string; description?: string | undefined; ingredients?: string[] | undefined }
```

### [

```
.required()
```

](https://zod.dev/api?id=required)

Zod provides an API for making some or all properties _required_, inspired by TypeScript's [

```
Required
```

](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype) utility type.

To make all properties required:

ZodZod Mini

```
const RequiredRecipe = Recipe.required();
// { title: string; description: string; ingredients: string[] }
```

To make certain properties required:

ZodZod Mini

```
const RecipeRequiredDescription = Recipe.required({description: true});
// { title: string; description: string; ingredients: string[] }
```

## [Recursive objects](https://zod.dev/api?id=recursive-objects)

To define a self-referential type, use a [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) on the key. This lets JavaScript resolve the cyclical schema at runtime.

```
const Category = z.object({
  name: z.string(),
  get subcategories(){
    return z.array(Category)
  }
});
type Category = z.infer<typeof Category>;
// { name: string; subcategories: Category[] }
```

Though recursive schemas are supported, passing cyclical data into Zod will cause an infinite loop.

You can also represent _mutually recursive types_:

```
const User = z.object({
  email: z.email(),
  get posts(){
    return z.array(Post)
  }
});
const Post = z.object({
  title: z.string(),
  get author(){
    return User
  }
});
```

All object APIs (

```
.pick()
```

,

```
.omit()
```

,

```
.required()
```

,

```
.partial()
```

, etc.) work as you'd expect.

### [Circularity errors](https://zod.dev/api?id=circularity-errors)

Due to TypeScript limitations, recursive type inference can be finicky, and it only works in certain scenarios. Some more complicated types may trigger recursive type errors like this:

```
const Activity = z.object({
  name: z.string(),
  get subactivities() {
    // ^ ❌ 'subactivities' implicitly has return type 'any' because it does not
    // have a return type annotation and is referenced directly or indirectly
    // in one of its return expressions.ts(7023)
    return z.nullable(z.array(Activity));
  },
});
```

In these cases, you can resolve the error with a type annotation on the offending getter:

```
const Activity = z.object({
  name: z.string(),
  get subactivities(): z.ZodNullable<z.ZodArray<typeof Activity>> {
    return z.nullable(z.array(Activity));
  },
});
```

## [Arrays](https://zod.dev/api?id=arrays)

To define an array schema:

ZodZod Mini

```
const stringArray = z.array(z.string()); // or z.string().array()
```

To access the inner schema for an element of the array.

ZodZod Mini

```
stringArray.unwrap(); // => string schema
```

Zod implements a number of array-specific validations:

ZodZod Mini

```
z.array(z.string()).min(5); // must contain 5 or more items
z.array(z.string()).max(5); // must contain 5 or fewer items
z.array(z.string()).length(5); // must contain 5 items exactly
```

## [Tuples](https://zod.dev/api?id=tuples)

Unlike arrays, tuples are typically fixed-length arrays that specify different schemas for each index.

```
const MyTuple = z.tuple([
  z.string(),
  z.number(),
  z.boolean()
]);
type MyTuple = z.infer<typeof MyTuple>;
// [string, number, boolean]
```

To add a variadic ("rest") argument:

```
const variadicTuple = z.tuple([z.string()], z.number());
// => [string, ...number[]];
```

## [Unions](https://zod.dev/api?id=unions)

Union types (

```
A | B
```

) represent a logical "OR". Zod union schemas will check the input against each option in order. The first value that validates successfully is returned.

```
const stringOrNumber = z.union([z.string(), z.number()]);
// string | number
stringOrNumber.parse("foo"); // passes
stringOrNumber.parse(14); // passes
```

To extract the internal option schemas:

ZodZod Mini

```
stringOrNumber.options; // [ZodString, ZodNumber]
```

## [Discriminated unions](https://zod.dev/api?id=discriminated-unions)

A [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) is a special kind of union in which a) all the options are object schemas that b) share a particular key (the "discriminator"). Based on the value of the discriminator key, TypeScript is able to "narrow" the type signature as you'd expect.

```
type MyResult =
  | { status: "success"; data: string }
  | { status: "failed"; error: string };
function handleResult(result: MyResult){
  if(result.status === "success"){
    result.data; // string
  } else {
    result.error; // string
  }
}
```

You could represent it with a regular

```
z.union()
```

. But regular unions are _naive_—they check the input against each option in order and return the first one that passes. This can be slow for large unions.

So Zod provides a

```
z.discriminatedUnion()
```

API that uses a _discriminator key_ to make parsing more efficient.

```
const MyResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.string() }),
]);
```

### Nesting discriminated unions

## [Intersections](https://zod.dev/api?id=intersections)

Intersection types (

```
A & B
```

) represent a logical "AND".

```
const a = z.union([z.number(), z.string()]);
const b = z.union([z.number(), z.boolean()]);
const c = z.intersection(a, b);
type c = z.infer<typeof c>; // => number
```

This can be useful for intersecting two object types.

```
const Person = z.object({ name: z.string() });
type Person = z.infer<typeof Person>;
const Employee = z.object({ role: z.string() });
type Employee = z.infer<typeof Employee>;
const EmployedPerson = z.intersection(Person, Employee);
type EmployedPerson = z.infer<typeof EmployedPerson>;
// Person & Employee
```

When merging object schemas, prefer [

```
A.extend(B)
```

](#extend) over intersections. Using

```
.extend()
```

will give you a new object schema, whereas

```
z.intersection(A, B)
```

returns a

```
ZodIntersection
```

instance which lacks common object methods like

```
pick
```

and

```
omit
```

.

## [Records](https://zod.dev/api?id=records)

Record schemas are used to validate types such as

```
Record<string, number>
```

.

```
const IdCache = z.record(z.string(), z.string());
type IdCache = z.infer<typeof IdCache>; // Record<string, string>
IdCache.parse({
  carlotta: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",
  jimmie: "77d2586b-9e8e-4ecf-8b21-ea7e0530eadd",
});
```

The key schema can be any Zod schema that is assignable to

```
string | number | symbol
```

.

```
const Keys = z.union([z.string(), z.number(), z.symbol()]);
const AnyObject = z.record(Keys, z.unknown());
// Record<string | number | symbol, unknown>
```

To create an object schemas containing keys defined by an enum:

```
const Keys = z.enum(["id", "name", "email"]);
const Person = z.record(Keys, z.string());
// { id: string; name: string; email: string }
```

**Zod 4** — In Zod 4, if you pass a

```
z.enum
```

as the first argument to

```
z.record()
```

, Zod will exhaustively check that all enum values exist in the input as keys. This behavior agrees with TypeScript:

```
type MyRecord = Record<"a" | "b", string>;
const myRecord: MyRecord = { a: "foo", b: "bar" }; // ✅
const myRecord: MyRecord = { a: "foo" }; // ❌ missing required key `b`
```

In Zod 3, exhaustiveness was not checked. To replicate the old behavior, use

```
z.partialRecord()
```

.

If you want a _partial_ record type, use

```
z.partialRecord()
```

. This skips the special exhaustiveness checks Zod normally runs with

```
z.enum()
```

and

```
z.literal()
```

key schemas.

```
const Keys = z.enum(["id", "name", "email"]).or(z.never());
const Person = z.partialRecord(Keys, z.string());
// { id?: string; name?: string; email?: string }
```

### A note on numeric keys

## [Maps](https://zod.dev/api?id=maps)

```
const StringNumberMap = z.map(z.string(), z.number());
type StringNumberMap = z.infer<typeof StringNumberMap>; // Map<string, number>
const myMap: StringNumberMap = new Map();
myMap.set("one", 1);
myMap.set("two", 2);
StringNumberMap.parse(myMap);
```

## [Sets](https://zod.dev/api?id=sets)

```
const NumberSet = z.set(z.number());
type NumberSet = z.infer<typeof NumberSet>; // Set<number>
const mySet: NumberSet = new Set();
mySet.add(1);
mySet.add(2);
NumberSet.parse(mySet);
```

Set schemas can be further constrained with the following utility methods.

ZodZod Mini

```
z.set(z.string()).min(5); // must contain 5 or more items
z.set(z.string()).max(5); // must contain 5 or fewer items
z.set(z.string()).size(5); // must contain 5 items exactly
```

## [Files](https://zod.dev/api?id=files)

To validate

```
File
```

instances:

ZodZod Mini

```
const fileSchema = z.file();
fileSchema.min(10_000); // minimum .size (bytes)
fileSchema.max(1_000_000); // maximum .size (bytes)
fileSchema.mime("image/png"); // MIME type
fileSchema.mime(["image/png", "image/jpeg"]); // multiple MIME types
```

## [Promises](https://zod.dev/api?id=promises)

**Deprecated** —

```
z.promise()
```

is deprecated in Zod 4. There are vanishingly few valid uses cases for a

```
Promise
```

schema. If you suspect a value might be a

```
Promise
```

, simply

```
await
```

it before parsing it with Zod.

### See z.promise() documentation

## [Instanceof](https://zod.dev/api?id=instanceof)

You can use

```
z.instanceof
```

to check that the input is an instance of a class. This is useful to validate inputs against classes that are exported from third-party libraries.

```
class Test {
  name: string;
}
const TestSchema = z.instanceof(Test);
TestSchema.parse(new Test()); // ✅
TestSchema.parse("whatever"); // ❌
```

### [Property](https://zod.dev/api?id=property)

To validate a particular property of a class instance against a Zod schema:

```
const blobSchema = z.instanceof(URL).check(
  z.property("protocol", z.literal("https:" as string, "Only HTTPS allowed"))
);
blobSchema.parse(new URL("https://example.com")); // ✅
blobSchema.parse(new URL("http://example.com")); // ❌
```

The

```
z.property()
```

API works with any data type (but it's most useful when used in conjunction with

```
z.instanceof()
```

).

```
const blobSchema = z.string().check(
  z.property("length", z.number().min(10))
);
blobSchema.parse("hello there!"); // ✅
blobSchema.parse("hello."); // ❌
```

## [Refinements](https://zod.dev/api?id=refinements)

Every Zod schema stores an array of _refinements_. Refinements are a way to perform custom validation that Zod doesn't provide a native API for.

### [

```
.refine()
```

](https://zod.dev/api?id=refine)

ZodZod Mini

```
const myString = z.string().refine((val) => val.length <= 255);
```

Refinement functions should never throw. Instead they should return a falsy value to signal failure. Thrown errors are not caught by Zod.

#### [

```
error
```

](https://zod.dev/api?id=error)

To customize the error message:

ZodZod Mini

```
const myString = z.string().refine((val) => val.length > 8, {
  error: "Too short!"
});
```

#### [

```
abort
```

](https://zod.dev/api?id=abort)

By default, validation issues from checks are considered _continuable_; that is, Zod will execute _all_ checks in sequence, even if one of them causes a validation error. This is usually desirable, as it means Zod can surface as many errors as possible in one go.

ZodZod Mini

```
const myString = z.string()
  .refine((val) => val.length > 8, { error: "Too short!" })
  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase" });
const result = myString.safeParse("OH NO");
result.error.issues;
/* [
  { "code": "custom", "message": "Too short!" },
  { "code": "custom", "message": "Must be lowercase" }
] */
```

To mark a particular refinement as _non-continuable_, use the

```
abort
```

parameter. Validation will terminate if the check fails.

ZodZod Mini

```
const myString = z.string()
  .refine((val) => val.length > 8, { error: "Too short!", abort: true })
  .refine((val) => val === val.toLowerCase(), { error: "Must be lowercase", abort: true });
const result = myString.safeParse("OH NO");
result.error!.issues;
// => [{ "code": "custom", "message": "Too short!" }]
```

#### [

```
path
```

](https://zod.dev/api?id=path)

To customize the error path, use the

```
path
```

parameter. This is typically only useful in the context of object schemas.

ZodZod Mini

```
const passwordForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });
```

This will set the

```
path
```

parameter in the associated issue:

ZodZod Mini

```
const result = passwordForm.safeParse({ password: "asdf", confirm: "qwer" });
result.error.issues;
/* [{
  "code": "custom",
  "path": [ "confirm" ],
  "message": "Passwords don't match"
}] */
```

To define an asynchronous refinement, just pass an

```
async
```

function:

```
const userId = z.string().refine(async (id) => {
  // verify that ID exists in database
  return true;
});
```

If you use async refinements, you must use the

```
.parseAsync
```

method to parse data! Otherwise Zod will throw an error.

ZodZod Mini

```
const result = await userId.parseAsync("abc123");
```

#### [

```
when
```

](https://zod.dev/api?id=when)

**Note** — This is a power user feature and can absolutely be abused in ways that will increase the probability of uncaught errors originating from inside your refinements.

By default, refinements don't run if any _non-continuable_ issues have already been encountered. Zod is careful to ensure the type signature of the value is correct before passing it into any refinement functions.

```
const schema = z.string().refine((val) => {
  return val.length > 8
});
schema.parse(1234); // invalid_type: refinement won't be executed
```

In some cases, you want finer control over when refinements run. For instance consider this "password confirm" check:

ZodZod Mini

```
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    anotherField: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
schema.parse({
  password: "asdf",
  confirmPassword: "asdf",
  anotherField: 1234 // ❌ this error will prevent the password check from running
});
```

An error on

```
anotherField
```

will prevent the password confirmation check from executing, even though the check doesn't depend on

```
anotherField
```

. To control when a refinement will run, use the

```
when
```

parameter:

ZodZod Mini

```
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    anotherField: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    // run if password & confirmPassword are valid
    when(payload) {
      return schema
        .pick({ password: true, confirmPassword: true })
        .safeParse(payload.value).success;
    },
  });
schema.parse({
  password: "asdf",
  confirmPassword: "asdf",
  anotherField: 1234 // ❌ this error will not prevent the password check from running
});
```

### [

```
.superRefine()
```

](https://zod.dev/api?id=superrefine)

The regular

```
.refine
```

API only generates a single issue with a

```
"custom"
```

error code, but

```
.superRefine()
```

makes it possible to create multiple issues using any of Zod's [internal issue types](https://github.com/colinhacks/zod/blob/main/packages/zod/src/v4/core/errors.ts).

ZodZod Mini

```
const UniqueStringArray = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({
      code: "too_big",
      maximum: 3,
      origin: "array",
      inclusive: true,
      message: "Too many items 😡",
      input: val,
    });
  }
  if (val.length !== new Set(val).size) {
    ctx.addIssue({
      code: "custom",
      message: `No duplicates allowed.`,
      input: val,
    });
  }
});

```

### [

```
.check()
```

](https://zod.dev/api?id=check)

**Note** — The

```
.check()
```

API is a more low-level API that's generally more complex than

```
.superRefine()
```

. It can be faster in performance-sensitive code paths, but it's also more verbose.

### View example

## [Pipes](https://zod.dev/api?id=pipes)

Schemas can be chained together into "pipes". Pipes are primarily useful when used in conjunction with [Transforms](#transforms).

ZodZod Mini

```
const stringToLength = z.string().pipe(z.transform(val => val.length));
stringToLength.parse("hello"); // => 5
```

## [Transforms](https://zod.dev/api?id=transforms)

Transforms are a special kind of schema. Instead of validating input, they accept anything and perform some transformation on the data. To define a transform:

ZodZod Mini

```
const castToString = z.transform((val) => String(val));
castToString.parse("asdf"); // => "asdf"
castToString.parse(123); // => "123"
castToString.parse(true); // => "true"
```

Refinement functions should never throw. Thrown errors are not caught by Zod.

To perform validation logic inside a transform, use

```
ctx
```

. To report a validation issue, push a new issue onto

```
ctx.issues
```

(similar to the [

```
.check()
```

](#check) API).

```
const coercedInt = z.transform((val, ctx) => {
  try {
    const parsed = Number.parseInt(String(val));
    return parsed;
  } catch (e) {
    ctx.issues.push({
      code: "custom",
      message: "Not a number",
      input: val,
    });
    // this is a special constant with type `never`
    // returning it lets you exit the transform without impacting the inferred return type
    return z.NEVER;
  }
});
```

Most commonly, transforms are used in conjunction with [Pipes](#pipes). This combination is useful for performing some initial validation, then transforming the parsed data into another form.

ZodZod Mini

```
const stringToLength = z.string().pipe(z.transform(val => val.length));
stringToLength.parse("hello"); // => 5
```

### [

```
.transform()
```

](https://zod.dev/api?id=transform)

Piping some schema into a transform is a common pattern, so Zod provides a convenience

```
.transform()
```

method.

ZodZod Mini

```
const stringToLength = z.string().transform(val => val.length);
```

Transforms can also be async:

ZodZod Mini

```
const idToUser = z
  .string()
  .transform(async (id) => {
    // fetch user from database
    return db.getUserById(id);
  });
const user = await idToUser.parseAsync("abc123");
```

If you use async transforms, you must use a

```
.parseAsync
```

or

```
.safeParseAsync
```

when parsing data! Otherwise Zod will throw an error.

### [

```
.preprocess()
```

](https://zod.dev/api?id=preprocess)

Piping a transform into another schema is another common pattern, so Zod provides a convenience

```
z.preprocess()
```

function.

```
const coercedInt = z.preprocess((val) => {
  if (typeof val === "string") {
    return Number.parseInt(val);
  }
  return val;
}, z.int());
```

## [Defaults](https://zod.dev/api?id=defaults)

To set a default value for a schema:

ZodZod Mini

```
const defaultTuna = z.string().default("tuna");
defaultTuna.parse(undefined); // => "tuna"
```

Alternatively, you can pass a function which will be re-executed whenever a default value needs to be generated:

ZodZod Mini

```
const randomDefault = z.number().default(Math.random);
randomDefault.parse(undefined);    // => 0.4413456736055323
randomDefault.parse(undefined);    // => 0.1871840107401901
randomDefault.parse(undefined);    // => 0.7223408162401552
```

## [Prefaults](https://zod.dev/api?id=prefaults)

In Zod, setting a _default_ value will short-circuit the parsing process. If the input is

```
undefined
```

, the default value is eagerly returned. As such, the default value must be assignable to the _output type_ of the schema.

```
const schema = z.string().transform(val => val.length).default(0);
schema.parse(undefined); // => 0
```

Sometimes, it's useful to define a _prefault_ ("pre-parse default") value. If the input is

```
undefined
```

, the prefault value will be parsed instead. The parsing process is _not_ short circuited. As such, the prefault value must be assignable to the _input type_ of the schema.

```
z.string().transform(val => val.length).prefault("tuna");
schema.parse(undefined); // => 4
```

This is also useful if you want to pass some input value through some mutating refinements.

```
const a = z.string().trim().toUpperCase().prefault("  tuna  ");
a.parse(undefined); // => "TUNA"
const b = z.string().trim().toUpperCase().default("  tuna  ");
b.parse(undefined); // => "  tuna  "
```

## [Catch](https://zod.dev/api?id=catch)

Use

```
.catch()
```

to define a fallback value to be returned in the event of a validation error:

ZodZod Mini

```
const numberWithCatch = z.number().catch(42);
numberWithCatch.parse(5); // => 5
numberWithCatch.parse("tuna"); // => 42
```

Alternatively, you can pass a function which will be re-executed whenever a catch value needs to be generated.

ZodZod Mini

```
const numberWithRandomCatch = z.number().catch((ctx) => {
  ctx.error; // the caught ZodError
  return Math.random();
});
numberWithRandomCatch.parse("sup"); // => 0.4413456736055323
numberWithRandomCatch.parse("sup"); // => 0.1871840107401901
numberWithRandomCatch.parse("sup"); // => 0.7223408162401552
```

## [Branded types](https://zod.dev/api?id=branded-types)

TypeScript's type system is [structural](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), meaning that two types that are structurally equivalent are considered the same.

```
type Cat = { name: string };
type Dog = { name: string };
const pluto: Dog = { name: "pluto" };
const simba: Cat = pluto; // works fine
```

In some cases, it can be desirable to simulate [nominal typing](https://en.wikipedia.org/wiki/Nominal_type_system) inside TypeScript. This can be achieved with _branded types_ (also known as "opaque types").

```
const Cat = z.object({ name: z.string() }).brand<"Cat">();
const Dog = z.object({ name: z.string() }).brand<"Dog">();
type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">
type Dog = z.infer<typeof Dog>; // { name: string } & z.$brand<"Dog">
const pluto = Dog.parse({ name: "pluto" });
const simba: Cat = pluto; // ❌ not allowed
```

Under the hood, this works by attaching a "brand" to the schema's inferred type.

```
const Cat = z.object({ name: z.string() }).brand<"Cat">();
type Cat = z.infer<typeof Cat>; // { name: string } & z.$brand<"Cat">
```

With this brand, any plain (unbranded) data structures are no longer assignable to the inferred type. You have to parse some data with the schema to get branded data.

Note that branded types do not affect the runtime result of

```
.parse
```

. It is a static-only construct.

## [Readonly](https://zod.dev/api?id=readonly)

To mark a schema as readonly:

ZodZod Mini

```
const ReadonlyUser = z.object({ name: z.string() }).readonly();
type ReadonlyUser = z.infer<typeof ReadonlyUser>;
// Readonly<{ name: string }>
```

The inferred type of the new schemas will be marked as

```
readonly
```

. Note that in TypeScript, this only affects objects, arrays, tuples,

```
Set
```

, and

```
Map
```

:

ZodZod Mini

```
z.object({ name: z.string() }).readonly(); // { readonly name: string }
z.array(z.string()).readonly(); // readonly string[]
z.tuple([z.string(), z.number()]).readonly(); // readonly [string, number]
z.map(z.string(), z.date()).readonly(); // ReadonlyMap<string, Date>
z.set(z.string()).readonly(); // ReadonlySet<string>
```

Inputs will be parsed like normal, then the result will be frozen with [

```
Object.freeze()
```

](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) to prevent modifications.

ZodZod Mini

```
const result = ReadonlyUser.parse({ name: "fido" });
result.name = "simba"; // throws TypeError
```

## [JSON](https://zod.dev/api?id=json)

To validate any JSON-encodable value:

```
const jsonSchema = z.json();
```

This is a convenience API that returns the following union schema:

```
const jsonSchema = z.lazy(() => {
  return z.union([
    z.string(params),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema)
  ]);
});
```

## [Custom](https://zod.dev/api?id=custom)

You can create a Zod schema for any TypeScript type by using

```
z.custom()
```

. This is useful for creating schemas for types that are not supported by Zod out of the box, such as template string literals.

```
const px = z.custom<`${number}px`>((val) => {
  return typeof val === "string" ? /^\d+px$/.test(val) : false;
});
type px = z.infer<typeof px>; // `${number}px`
px.parse("42px"); // "42px"
px.parse("42vw"); // throws;
```

If you don't provide a validation function, Zod will allow any value. This can be dangerous!

```
z.custom<{ arg: string }>(); // performs no validation
```

You can customize the error message and other options by passing a second argument. This parameter works the same way as the params parameter of [

```
.refine
```

](#refine).

```
z.custom<...>((val) => ..., "custom error message");
```

## [Functions](https://zod.dev/api?id=functions)

In Zod 4,

```
z.function()
```

no longer returns a Zod schema.

Zod provides a

```
z.function()
```

utility for defining Zod-validated functions. This way, you can avoid intermixing validation code with your business logic.

```
const MyFunction = z.function({
  input: [z.string()], // parameters (must be an array or a ZodTuple)
  output: z.number()  // return type
});
```

Function schemas have an

```
.implement()
```

method which accepts a function and returns a new function that automatically validates its inputs and outputs.

```
const computeTrimmedLength = MyFunction.implement((input) => {
  // TypeScript knows input is a string!
  return input.trim().length;
});
computeTrimmedLength("sandwich"); // => 8
computeTrimmedLength(" asdf "); // => 4
```

This function will throw a

```
ZodError
```

if the input is invalid:

```
computeTrimmedLength(42); // throws ZodError
```

If you only care about validating inputs, you can omit the

```
output
```

field.

```
const MyFunction = z.function({
  input: [z.string()], // parameters (must be an array or a ZodTuple)
});
const computeTrimmedLength = MyFunction.implement((input) => input.trim.length);
```
