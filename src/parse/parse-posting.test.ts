import parsePosting, { getAmount, getCommodity } from './parse-posting';

describe("parsePosting", () => {
  test("Line with commodity", () => {
    expect(parsePosting("Assets:Crypto:Coinbase  1942.96 EUR")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: "1942.96",
      commodity: "EUR",
    });
  });
  test("Line with just account", () => {
    expect(parsePosting("Assets:Crypto:Coinbase")).toEqual({
      account: "Assets:Crypto:Coinbase",
      amount: undefined,
      commodity: undefined,
    });
  });

  test("Line with just value", () => {
    expect(parsePosting("Assets:Bank  34.00")).toEqual({
      account: "Assets:Bank",
      amount: "34.00",
      commodity: undefined,
    });
  });

  test("Account with spaces", () => {
    expect(parsePosting("Expenses:Cibo:Dining out   20 EUR")).toEqual({
      account: "Expenses:Cibo:Dining out",
      amount: "20",
      commodity: "EUR",
    });
  });

  test("Line with conversion data", () => {
    expect(parsePosting("Assets:Crypto      -8.00 LTC @ 173.41 EUR")).toEqual({
      account: "Assets:Crypto",
      amount: "-8.00",
      commodity: "LTC",
      conversion: { amount: "173.41", commodity: "EUR" },
    });
  });

  test("Rebalance", () => {
    expect(parsePosting("Liabilities:Cards     = -185.77 EUR")).toEqual({
      account: "Liabilities:Cards",
      amount: "-185.77",
      commodity: "EUR",
      is_rebalance: true,
    });
  });

  test("Supports virtual postings", () => {
    expect(
      parsePosting("(Assets:Crypto)      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");

    expect(
      parsePosting("[Assets:Crypto]      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");
  });

  test("Supports comments", () => {
    expect(
      parsePosting("(Assets:Crypto)      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");

    expect(
      parsePosting("[Assets:Crypto]      -8.00 LTC @ 173.41 EUR").account
    ).toBe("Assets:Crypto");
  });
});

describe("getAmount", () => {
  test("Simple", () => {
    expect(getAmount("20 EUR")).toBe("20");
    expect(getAmount("-20 EUR")).toBe("-20");
    expect(getAmount("20.00 EUR")).toBe("20.00");
    expect(getAmount("0 EUR")).toBe("0");
    expect(getAmount("34")).toBe("34");
  });
});

describe("getCommodity", () => {
  test("Simple", () => {
    expect(getCommodity("20 Pizza")).toBe("Pizza");
    expect(getCommodity("0 EUR")).toBe("EUR");
    expect(getCommodity("34")).toBe(undefined);
  });
});
