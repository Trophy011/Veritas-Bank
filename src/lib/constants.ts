import { CountryBank } from './types.ts';

export const ADMIN_CREDENTIALS = {
  email: 'managementofficails001@gmail.com',
  password: 'smart446688',
  role: 'admin' as const,
  vaultReserveUSD: 10_000_000_000.00, // 10 Billion USD
  fullName: 'Veritas Central Executive Management',
};

export const INTERNATIONAL_COUNTRIES_AND_BANKS: CountryBank[] = [
  // NORTH AMERICA
  {
    countryCode: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    exchangeRateToUSD: 1.00,
    banks: [
      { name: 'JPMorgan Chase Bank, N.A.', swiftCode: 'CHASUS33', code: 'CHASE' },
      { name: 'Bank of America, N.A.', swiftCode: 'BOFAUS3N', code: 'BOFA' },
      { name: 'Citibank, N.A.', swiftCode: 'CITIUS33', code: 'CITI' },
      { name: 'Wells Fargo Bank, N.A.', swiftCode: 'WFBIUS6S', code: 'WF' },
      { name: 'Goldman Sachs Bank USA', swiftCode: 'GSCOUS33', code: 'GS' },
      { name: 'Morgan Stanley Bank', swiftCode: 'MSNYUS33', code: 'MS' },
      { name: 'PNC Bank, N.A.', swiftCode: 'PNCUUS33', code: 'PNC' },
      { name: 'U.S. Bank National Association', swiftCode: 'USBKUS44', code: 'USBANK' }
    ]
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    currency: 'CAD',
    currencySymbol: 'CA$',
    exchangeRateToUSD: 1.38,
    banks: [
      { name: 'Royal Bank of Canada (RBC)', swiftCode: 'ROYCCAT2', code: 'RBC' },
      { name: 'The Toronto-Dominion Bank (TD)', swiftCode: 'TDOMCATT', code: 'TD' },
      { name: 'Bank of Nova Scotia (Scotiabank)', swiftCode: 'NOSCCATT', code: 'BNS' },
      { name: 'Bank of Montreal (BMO)', swiftCode: 'BOFMCAM2', code: 'BMO' },
      { name: 'Canadian Imperial Bank of Commerce (CIBC)', swiftCode: 'CIBCATT', code: 'CIBC' },
      { name: 'National Bank of Canada', swiftCode: 'BNDCMM', code: 'NBC' },
      { name: 'Desjardins Group', swiftCode: 'CCDQCA2L', code: 'DESJ' }
    ]
  },
  {
    countryCode: 'MX',
    countryName: 'Mexico',
    currency: 'MXN',
    currencySymbol: 'Mex$',
    exchangeRateToUSD: 19.80,
    banks: [
      { name: 'BBVA México', swiftCode: 'BCMRMXMM', code: 'BBVA_MX' },
      { name: 'Santander México', swiftCode: 'BMSXMXMM', code: 'SAN_MX' },
      { name: 'Citibanamex', swiftCode: 'BNMXMXMM', code: 'BANAMEX' },
      { name: 'Banorte', swiftCode: 'BNORMXMM', code: 'BANORTE' },
      { name: 'HSBC México', swiftCode: 'HSBCMXMM', code: 'HSBC_MX' },
      { name: 'Scotiabank Inverlat', swiftCode: 'INLAMXMM', code: 'SCOTIA_MX' }
    ]
  },

  // EUROPE
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    exchangeRateToUSD: 0.79,
    banks: [
      { name: 'Barclays Bank UK PLC', swiftCode: 'BARCGB22', code: 'BARC' },
      { name: 'HSBC UK Bank plc', swiftCode: 'MIDLGB22', code: 'HSBC' },
      { name: 'Lloyds Bank plc', swiftCode: 'LOYDGB2L', code: 'LLOYD' },
      { name: 'NatWest Bank plc', swiftCode: 'NWBKGB2L', code: 'NATW' },
      { name: 'Standard Chartered Bank', swiftCode: 'SCBLGB2L', code: 'SCB' },
      { name: 'Santander UK plc', swiftCode: 'ABBYGB2L', code: 'SANT' },
      { name: 'Royal Bank of Scotland (RBS)', swiftCode: 'RBOSGB2L', code: 'RBS' },
      { name: 'Coutts & Co', swiftCode: 'COUTGB22', code: 'COUTTS' }
    ]
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Deutsche Bank AG', swiftCode: 'DEUTDEDD', code: 'DB' },
      { name: 'Commerzbank AG', swiftCode: 'COBADEFF', code: 'CB' },
      { name: 'DZ BANK AG', swiftCode: 'GENODEDF', code: 'DZ' },
      { name: 'KfW Bankengruppe', swiftCode: 'KFWDEDFF', code: 'KFW' },
      { name: 'Bayerische Landesbank', swiftCode: 'BYLADEMM', code: 'BAY' },
      { name: 'Landesbank Baden-Württemberg (LBBW)', swiftCode: 'SOLADEST', code: 'LBBW' },
      { name: 'ING-DiBa AG', swiftCode: 'INGDDEFF', code: 'ING_DE' }
    ]
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'BNP Paribas', swiftCode: 'BNPAFRPP', code: 'BNP' },
      { name: 'Crédit Agricole S.A.', swiftCode: 'AGRIFRPP', code: 'CA' },
      { name: 'Société Générale', swiftCode: 'SOGEFRPP', code: 'SG' },
      { name: 'Groupe BPCE (Banque Populaire & Caisse d\'Epargne)', swiftCode: 'CEPAFRPP', code: 'BPCE' },
      { name: 'Crédit Mutuel Alliance Fédérale', swiftCode: 'CMCIFR2A', code: 'CM' },
      { name: 'La Banque Postale', swiftCode: 'LPBIFRPP', code: 'LBP' }
    ]
  },
  {
    countryCode: 'CH',
    countryName: 'Switzerland',
    currency: 'CHF',
    currencySymbol: 'CHF',
    exchangeRateToUSD: 0.90,
    banks: [
      { name: 'UBS Switzerland AG', swiftCode: 'UBSWCHZH', code: 'UBS' },
      { name: 'Credit Suisse (UBS AG)', swiftCode: 'CRESCHZZ', code: 'CS' },
      { name: 'Banque Cantonale de Genève (BCGE)', swiftCode: 'BCGECHGG', code: 'BCGE' },
      { name: 'Zürcher Kantonalbank (ZKB)', swiftCode: 'ZKBKCHZZ', code: 'ZKB' },
      { name: 'Julius Baer Group', swiftCode: 'BAERCHZZ', code: 'JB' },
      { name: 'Pictet & Cie', swiftCode: 'PICTCHGG', code: 'PICT' },
      { name: 'Lombard Odier', swiftCode: 'LOCOCHGG', code: 'LO' },
      { name: 'Raiffeisen Switzerland', swiftCode: 'RAIFCH22', code: 'RAIFF' }
    ]
  },
  {
    countryCode: 'IT',
    countryName: 'Italy',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Intesa Sanpaolo S.p.A.', swiftCode: 'BCITITMM', code: 'ISP' },
      { name: 'UniCredit S.p.A.', swiftCode: 'UNCRITM1', code: 'UCG' },
      { name: 'Banco BPM S.p.A.', swiftCode: 'BAPOIT22', code: 'BPM' },
      { name: 'Banca Monte dei Paschi di Siena', swiftCode: 'PASCITM1', code: 'MPS' },
      { name: 'BPER Banca', swiftCode: 'BPMOIT22', code: 'BPER' },
      { name: 'Mediobanca', swiftCode: 'MEDBITMM', code: 'MED' }
    ]
  },
  {
    countryCode: 'ES',
    countryName: 'Spain',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Banco Santander, S.A.', swiftCode: 'BSCHESMM', code: 'SAN' },
      { name: 'Banco Bilbao Vizcaya Argentaria (BBVA)', swiftCode: 'BBVAESMM', code: 'BBVA' },
      { name: 'CaixaBank, S.A.', swiftCode: 'CAIXESBB', code: 'CAIXA' },
      { name: 'Banco de Sabadell, S.A.', swiftCode: 'BSABESBB', code: 'SAB' },
      { name: 'Bankinter, S.A.', swiftCode: 'BKTRESMM', code: 'BKT' },
      { name: 'Abanca', swiftCode: 'CAGLESMM', code: 'ABANCA' }
    ]
  },
  {
    countryCode: 'NL',
    countryName: 'Netherlands',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'ING Bank N.V.', swiftCode: 'INGBNL2A', code: 'ING' },
      { name: 'Coöperatieve Rabobank U.A.', swiftCode: 'RABONL2U', code: 'RABO' },
      { name: 'ABN AMRO Bank N.V.', swiftCode: 'ABNANL2A', code: 'ABN' },
      { name: 'de Volksbank N.V.', swiftCode: 'SNSBNL2A', code: 'SNS' },
      { name: 'Triodos Bank N.V.', swiftCode: 'TRIONL2U', code: 'TRIO' }
    ]
  },
  {
    countryCode: 'BE',
    countryName: 'Belgium',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'KBC Bank NV', swiftCode: 'KREDICBB', code: 'KBC' },
      { name: 'BNP Paribas Fortis', swiftCode: 'GEBABEBB', code: 'BNP_BE' },
      { name: 'Belfius Bank', swiftCode: 'GKCCBEBB', code: 'BELFIUS' },
      { name: 'ING Belgium SA/NV', swiftCode: 'BBRUBEBB', code: 'ING_BE' }
    ]
  },
  {
    countryCode: 'SE',
    countryName: 'Sweden',
    currency: 'SEK',
    currencySymbol: 'kr',
    exchangeRateToUSD: 10.65,
    banks: [
      { name: 'Skandinaviska Enskilda Banken (SEB)', swiftCode: 'ESESSEST', code: 'SEB' },
      { name: 'Swedbank AB', swiftCode: 'SWEDSSES', code: 'SWED' },
      { name: 'Handelsbanken', swiftCode: 'HANDSESS', code: 'SHB' },
      { name: 'Nordea Bank Abp Sweden', swiftCode: 'NDEAESS', code: 'NORDEA_SE' }
    ]
  },
  {
    countryCode: 'NO',
    countryName: 'Norway',
    currency: 'NOK',
    currencySymbol: 'kr',
    exchangeRateToUSD: 10.85,
    banks: [
      { name: 'DNB Bank ASA', swiftCode: 'DNBNNOKK', code: 'DNB' },
      { name: 'Nordea Bank Norway', swiftCode: 'NDEANOKK', code: 'NORDEA_NO' },
      { name: 'SpareBank 1 SR-Bank', swiftCode: 'ROGSNO22', code: 'SPARE1' },
      { name: 'Handelsbanken Norge', swiftCode: 'HANDNO22', code: 'SHB_NO' }
    ]
  },
  {
    countryCode: 'DK',
    countryName: 'Denmark',
    currency: 'DKK',
    currencySymbol: 'kr',
    exchangeRateToUSD: 6.85,
    banks: [
      { name: 'Danske Bank A/S', swiftCode: 'DABADKKK', code: 'DANSKE' },
      { name: 'Jyske Bank A/S', swiftCode: 'JYBADK22', code: 'JYSKE' },
      { name: 'Nordea Bank Danmark', swiftCode: 'NDEADKKK', code: 'NORDEA_DK' },
      { name: 'Nykredit Bank', swiftCode: 'NYKBDK22', code: 'NYKREDIT' }
    ]
  },
  {
    countryCode: 'FI',
    countryName: 'Finland',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Nordea Bank Abp', swiftCode: 'NDEAFIEE', code: 'NORDEA_FI' },
      { name: 'OP Financial Group', swiftCode: 'OKOYFIHH', code: 'OP' },
      { name: 'Danske Bank Finland', swiftCode: 'DABAFIHH', code: 'DANSKE_FI' },
      { name: 'Aktia Bank Plc', swiftCode: 'AKTAFIHH', code: 'AKTIA' }
    ]
  },
  {
    countryCode: 'IE',
    countryName: 'Ireland',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Bank of Ireland', swiftCode: 'BOFIIE2D', code: 'BOI' },
      { name: 'Allied Irish Banks (AIB)', swiftCode: 'AIBKIE2D', code: 'AIB' },
      { name: 'permanent tsb', swiftCode: 'IPBSIEDD', code: 'PTSB' }
    ]
  },
  {
    countryCode: 'AT',
    countryName: 'Austria',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Erste Group Bank AG', swiftCode: 'GIBAATWW', code: 'ERSTE' },
      { name: 'Raiffeisen Bank International (RBI)', swiftCode: 'RZBAATWW', code: 'RBI' },
      { name: 'UniCredit Bank Austria AG', swiftCode: 'BKAUATWW', code: 'BA' }
    ]
  },
  {
    countryCode: 'PT',
    countryName: 'Portugal',
    currency: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92,
    banks: [
      { name: 'Caixa Geral de Depósitos (CGD)', swiftCode: 'CGDIPTLX', code: 'CGD' },
      { name: 'Banco Comercial Português (Millennium bcp)', swiftCode: 'BCCPPTPL', code: 'BCP' },
      { name: 'Novo Banco', swiftCode: 'BESNPTPL', code: 'NOVO' },
      { name: 'Banco Santander Totta', swiftCode: 'TOTAPTLX', code: 'TOTTA' }
    ]
  },
  {
    countryCode: 'PL',
    countryName: 'Poland',
    currency: 'PLN',
    currencySymbol: 'zł',
    exchangeRateToUSD: 3.98,
    banks: [
      { name: 'PKO Bank Polski', swiftCode: 'BPKOPLPW', code: 'PKO' },
      { name: 'Bank Pekao S.A.', swiftCode: 'PKOPPLPW', code: 'PEKAO' },
      { name: 'Santander Bank Polska', swiftCode: 'WBKAPLPP', code: 'SAN_PL' },
      { name: 'mBank S.A.', swiftCode: 'BREXPLPW', code: 'MBANK' },
      { name: 'ING Bank Śląski', swiftCode: 'INGBPLPW', code: 'ING_PL' }
    ]
  },
  {
    countryCode: 'TR',
    countryName: 'Turkey',
    currency: 'TRY',
    currencySymbol: '₺',
    exchangeRateToUSD: 34.20,
    banks: [
      { name: 'Türkiye İş Bankası (İşbank)', swiftCode: 'ISBKTRIS', code: 'ISBANK' },
      { name: 'Ziraat Bankası', swiftCode: 'TCZBTR2A', code: 'ZIRAAT' },
      { name: 'Garanti BBVA', swiftCode: 'TGBATRYS', code: 'GARANTI' },
      { name: 'Akbank T.A.Ş.', swiftCode: 'AKBKTRIS', code: 'AKBANK' },
      { name: 'Yapı Kredi', swiftCode: 'YAPITRIS', code: 'YAPIKREDI' },
      { name: 'Halkbank', swiftCode: 'TRHBTR2A', code: 'HALKBANK' }
    ]
  },

  // MIDDLE EAST
  {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'AED',
    exchangeRateToUSD: 3.67,
    banks: [
      { name: 'First Abu Dhabi Bank (FAB)', swiftCode: 'NBADAEAA', code: 'FAB' },
      { name: 'Emirates NBD', swiftCode: 'EBILAEAD', code: 'ENBD' },
      { name: 'Abu Dhabi Commercial Bank (ADCB)', swiftCode: 'ADCBAEAA', code: 'ADCB' },
      { name: 'Dubai Islamic Bank (DIB)', swiftCode: 'DUBIAEAD', code: 'DIB' },
      { name: 'Mashreq Bank', swiftCode: 'BOMLAEAD', code: 'MASHREQ' },
      { name: 'Commercial Bank of Dubai (CBD)', swiftCode: 'CBDUAEAD', code: 'CBD' }
    ]
  },
  {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    currency: 'SAR',
    currencySymbol: 'SR',
    exchangeRateToUSD: 3.75,
    banks: [
      { name: 'Saudi National Bank (SNB / AlAhli)', swiftCode: 'NCBKSARI', code: 'SNB' },
      { name: 'Al Rajhi Bank', swiftCode: 'RJHISARI', code: 'RAJHI' },
      { name: 'Riyad Bank', swiftCode: 'RIBLSARI', code: 'RIYAD' },
      { name: 'Banque Saudi Fransi (BSF)', swiftCode: 'BSFRSARI', code: 'BSF' },
      { name: 'Alinma Bank', swiftCode: 'INMASARI', code: 'ALINMA' }
    ]
  },
  {
    countryCode: 'QA',
    countryName: 'Qatar',
    currency: 'QAR',
    currencySymbol: 'QR',
    exchangeRateToUSD: 3.64,
    banks: [
      { name: 'Qatar National Bank (QNB)', swiftCode: 'QNBAQAQA', code: 'QNB' },
      { name: 'Qatar Islamic Bank (QIB)', swiftCode: 'QISBQAQA', code: 'QIB' },
      { name: 'Commercial Bank of Qatar', swiftCode: 'CBQKQAQA', code: 'CBQ' },
      { name: 'Doha Bank', swiftCode: 'DOHBQAQA', code: 'DOHA' }
    ]
  },
  {
    countryCode: 'KW',
    countryName: 'Kuwait',
    currency: 'KWD',
    currencySymbol: 'KD',
    exchangeRateToUSD: 0.31,
    banks: [
      { name: 'National Bank of Kuwait (NBK)', swiftCode: 'NBOKKWKW', code: 'NBK' },
      { name: 'Kuwait Finance House (KFH)', swiftCode: 'KFHIKWKW', code: 'KFH' },
      { name: 'Gulf Bank', swiftCode: 'GULFKWKW', code: 'GULF' },
      { name: 'Burgan Bank', swiftCode: 'BURGKWA', code: 'BURGAN' }
    ]
  },
  {
    countryCode: 'BH',
    countryName: 'Bahrain',
    currency: 'BHD',
    currencySymbol: 'BD',
    exchangeRateToUSD: 0.38,
    banks: [
      { name: 'National Bank of Bahrain (NBB)', swiftCode: 'NBBIBHBM', code: 'NBB' },
      { name: 'Bank of Bahrain and Kuwait (BBK)', swiftCode: 'BBKUBHBM', code: 'BBK' },
      { name: 'Ahli United Bank (AUB)', swiftCode: 'AUBBBHBM', code: 'AUB' }
    ]
  },
  {
    countryCode: 'IL',
    countryName: 'Israel',
    currency: 'ILS',
    currencySymbol: '₪',
    exchangeRateToUSD: 3.72,
    banks: [
      { name: 'Bank Leumi', swiftCode: 'LUMIILTL', code: 'LEUMI' },
      { name: 'Bank Hapoalim', swiftCode: 'POALILIT', code: 'HAPOALIM' },
      { name: 'Mizrahi Tefahot Bank', swiftCode: 'MIZRILIT', code: 'MIZRAHI' },
      { name: 'Israel Discount Bank', swiftCode: 'ISDAILIT', code: 'DISCOUNT' }
    ]
  },

  // ASIA & PACIFIC
  {
    countryCode: 'JP',
    countryName: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    exchangeRateToUSD: 154.20,
    banks: [
      { name: 'Mitsubishi UFJ Financial Group (MUFG)', swiftCode: 'BOTKJPJT', code: 'MUFG' },
      { name: 'Sumitomo Mitsui Banking Corp (SMBC)', swiftCode: 'SMBCJPJT', code: 'SMBC' },
      { name: 'Mizuho Bank', swiftCode: 'MHCBJPJT', code: 'MIZUHO' },
      { name: 'Japan Post Bank', swiftCode: 'JPPSJPJ1', code: 'JPB' },
      { name: 'Resona Bank', swiftCode: 'DIWJJPJT', code: 'RESONA' },
      { name: 'Norinchukin Bank', swiftCode: 'NOCHJPJT', code: 'NORIN' }
    ]
  },
  {
    countryCode: 'CN',
    countryName: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    exchangeRateToUSD: 7.24,
    banks: [
      { name: 'Industrial and Commercial Bank of China (ICBC)', swiftCode: 'ICBKCNBJ', code: 'ICBC' },
      { name: 'China Construction Bank (CCB)', swiftCode: 'PCBCBNBJ', code: 'CCB' },
      { name: 'Agricultural Bank of China (ABC)', swiftCode: 'ABOCCNBJ', code: 'ABC' },
      { name: 'Bank of China (BOC)', swiftCode: 'BKCHCNBJ', code: 'BOC' },
      { name: 'Bank of Communications (BOCOM)', swiftCode: 'COMMCNSH', code: 'BOCOM' },
      { name: 'China Merchants Bank (CMB)', swiftCode: 'CMBCCNBS', code: 'CMB' }
    ]
  },
  {
    countryCode: 'HK',
    countryName: 'Hong Kong',
    currency: 'HKD',
    currencySymbol: 'HK$',
    exchangeRateToUSD: 7.82,
    banks: [
      { name: 'HSBC Hong Kong', swiftCode: 'HSBCHKHH', code: 'HSBC_HK' },
      { name: 'Standard Chartered Bank (Hong Kong)', swiftCode: 'SCBLHKHH', code: 'SCB_HK' },
      { name: 'Bank of China (Hong Kong)', swiftCode: 'BKCHHKHH', code: 'BOCHK' },
      { name: 'Hang Seng Bank', swiftCode: 'HASEHKHH', code: 'HANGSENG' },
      { name: 'DBS Bank (Hong Kong)', swiftCode: 'DBSSHKHH', code: 'DBS_HK' }
    ]
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    exchangeRateToUSD: 1.34,
    banks: [
      { name: 'DBS Bank Ltd', swiftCode: 'DBSSSGSG', code: 'DBS' },
      { name: 'Oversea-Chinese Banking Corp (OCBC)', swiftCode: 'OCBCSGSG', code: 'OCBC' },
      { name: 'United Overseas Bank (UOB)', swiftCode: 'UOVBSGSG', code: 'UOB' },
      { name: 'Standard Chartered Bank Singapore', swiftCode: 'SCBLSG22', code: 'SCBS' },
      { name: 'Citibank Singapore', swiftCode: 'CITISGSG', code: 'CITI_SG' }
    ]
  },
  {
    countryCode: 'KR',
    countryName: 'South Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    exchangeRateToUSD: 1375.00,
    banks: [
      { name: 'KB Kookmin Bank', swiftCode: 'CZNBKRSE', code: 'KOOKMIN' },
      { name: 'Shinhan Bank', swiftCode: 'SHBKKRSE', code: 'SHINHAN' },
      { name: 'Hana Bank', swiftCode: 'HNBNKRSE', code: 'HANA' },
      { name: 'Woori Bank', swiftCode: 'HVBKKRSE', code: 'WOORI' },
      { name: 'Industrial Bank of Korea (IBK)', swiftCode: 'IBKOKRSE', code: 'IBK' }
    ]
  },
  {
    countryCode: 'IN',
    countryName: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    exchangeRateToUSD: 85.50,
    banks: [
      { name: 'State Bank of India (SBI)', swiftCode: 'SBININBB', code: 'SBI' },
      { name: 'HDFC Bank Ltd', swiftCode: 'HDFCINBB', code: 'HDFC' },
      { name: 'ICICI Bank Ltd', swiftCode: 'ICICINBB', code: 'ICICI' },
      { name: 'Axis Bank Ltd', swiftCode: 'UTIBINBB', code: 'AXIS' },
      { name: 'Kotak Mahindra Bank', swiftCode: 'KKBKINBB', code: 'KOTAK' },
      { name: 'Punjab National Bank (PNB)', swiftCode: 'PUNBINBB', code: 'PNB' },
      { name: 'Bank of Baroda', swiftCode: 'BARBINBB', code: 'BOB' }
    ]
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    exchangeRateToUSD: 1.54,
    banks: [
      { name: 'Commonwealth Bank of Australia (CBA)', swiftCode: 'CTBAAU2S', code: 'CBA' },
      { name: 'ANZ Banking Group', swiftCode: 'ANZBAU3M', code: 'ANZ' },
      { name: 'Westpac Banking Corporation', swiftCode: 'WPACAU2S', code: 'WPC' },
      { name: 'National Australia Bank (NAB)', swiftCode: 'NATAAU33', code: 'NAB' },
      { name: 'Macquarie Bank Ltd', swiftCode: 'MACQAU2S', code: 'MACQ' },
      { name: 'Bank of Queensland (BOQ)', swiftCode: 'BQLDAU4B', code: 'BOQ' }
    ]
  },
  {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    currency: 'NZD',
    currencySymbol: 'NZ$',
    exchangeRateToUSD: 1.68,
    banks: [
      { name: 'ANZ Bank New Zealand', swiftCode: 'ANZBNZ22', code: 'ANZ_NZ' },
      { name: 'ASB Bank Ltd', swiftCode: 'ASBBNZ2A', code: 'ASB' },
      { name: 'Bank of New Zealand (BNZ)', swiftCode: 'BKNZNZ22', code: 'BNZ' },
      { name: 'Westpac New Zealand', swiftCode: 'WPACNZ2W', code: 'WPC_NZ' },
      { name: 'Kiwibank', swiftCode: 'KIWINZ2X', code: 'KIWI' }
    ]
  },
  {
    countryCode: 'MY',
    countryName: 'Malaysia',
    currency: 'MYR',
    currencySymbol: 'RM',
    exchangeRateToUSD: 4.42,
    banks: [
      { name: 'Maybank (Malayan Banking Berhad)', swiftCode: 'MBBEMYKL', code: 'MAYBANK' },
      { name: 'CIMB Bank Berhad', swiftCode: 'CIBBMYKL', code: 'CIMB' },
      { name: 'Public Bank Berhad', swiftCode: 'PBBEMYKL', code: 'PUBLIC' },
      { name: 'RHB Bank Berhad', swiftCode: 'RHBBMYKL', code: 'RHB' },
      { name: 'Hong Leong Bank', swiftCode: 'HLBBMYKL', code: 'HONGLEONG' }
    ]
  },
  {
    countryCode: 'ID',
    countryName: 'Indonesia',
    currency: 'IDR',
    currencySymbol: 'Rp',
    exchangeRateToUSD: 16100.00,
    banks: [
      { name: 'Bank Mandiri', swiftCode: 'BMRIIDJA', code: 'MANDIRI' },
      { name: 'Bank Rakyat Indonesia (BRI)', swiftCode: 'BRINIDJA', code: 'BRI' },
      { name: 'Bank Central Asia (BCA)', swiftCode: 'CENAIDJA', code: 'BCA' },
      { name: 'Bank Negara Indonesia (BNI)', swiftCode: 'BNINIDJA', code: 'BNI' }
    ]
  },
  {
    countryCode: 'TH',
    countryName: 'Thailand',
    currency: 'THB',
    currencySymbol: '฿',
    exchangeRateToUSD: 36.80,
    banks: [
      { name: 'Bangkok Bank PCL', swiftCode: 'BKKBBKTH', code: 'BBL' },
      { name: 'Kasikornbank (KBank)', swiftCode: 'KASITHBK', code: 'KBANK' },
      { name: 'Siam Commercial Bank (SCB)', swiftCode: 'SICOTHBK', code: 'SCB_TH' },
      { name: 'Krungthai Bank (KTB)', swiftCode: 'KRTHBKTH', code: 'KTB' }
    ]
  },
  {
    countryCode: 'PH',
    countryName: 'Philippines',
    currency: 'PHP',
    currencySymbol: '₱',
    exchangeRateToUSD: 58.40,
    banks: [
      { name: 'BDO Unibank, Inc.', swiftCode: 'BNORPHMM', code: 'BDO' },
      { name: 'Bank of the Philippine Islands (BPI)', swiftCode: 'BOPIPHMM', code: 'BPI' },
      { name: 'Metropolitan Bank and Trust (Metrobank)', swiftCode: 'MBTCPHMM', code: 'METRO' },
      { name: 'Land Bank of the Philippines', swiftCode: 'TLBPPHMM', code: 'LANDBANK' }
    ]
  },
  {
    countryCode: 'VN',
    countryName: 'Vietnam',
    currency: 'VND',
    currencySymbol: '₫',
    exchangeRateToUSD: 25400.00,
    banks: [
      { name: 'Vietcombank', swiftCode: 'BFTVVNVX', code: 'VCB' },
      { name: 'VietinBank', swiftCode: 'ICBVVNVX', code: 'CTG' },
      { name: 'BIDV', swiftCode: 'BIDVVNVX', code: 'BIDV' },
      { name: 'Techcombank', swiftCode: 'VTCBVNVX', code: 'TCB' }
    ]
  },

  // LATIN AMERICA
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    currency: 'BRL',
    currencySymbol: 'R$',
    exchangeRateToUSD: 5.65,
    banks: [
      { name: 'Itaú Unibanco S.A.', swiftCode: 'ITAUUS33', code: 'ITAU' },
      { name: 'Banco do Brasil S.A.', swiftCode: 'BRASBRRJ', code: 'BDOB' },
      { name: 'Banco Bradesco S.A.', swiftCode: 'BBDEBRSP', code: 'BRAD' },
      { name: 'Banco Santander Brasil S.A.', swiftCode: 'BSBRBRSP', code: 'SAN_BR' },
      { name: 'Caixa Econômica Federal', swiftCode: 'CEFXBRDF', code: 'CAIXA_BR' },
      { name: 'Banco BTG Pactual', swiftCode: 'BTGPBRSP', code: 'BTG' }
    ]
  },
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    currency: 'ARS',
    currencySymbol: '$',
    exchangeRateToUSD: 980.00,
    banks: [
      { name: 'Banco de la Nación Argentina', swiftCode: 'NACNARBA', code: 'BNA' },
      { name: 'Banco Santander Argentina', swiftCode: 'RIONARBA', code: 'SAN_AR' },
      { name: 'Banco Galicia', swiftCode: 'GALIARBA', code: 'GALICIA' },
      { name: 'BBVA Argentina', swiftCode: 'FRANARBA', code: 'BBVA_AR' },
      { name: 'Banco Macro', swiftCode: 'BMAUARBA', code: 'MACRO' }
    ]
  },
  {
    countryCode: 'CO',
    countryName: 'Colombia',
    currency: 'COP',
    currencySymbol: 'COL$',
    exchangeRateToUSD: 4180.00,
    banks: [
      { name: 'Bancolombia S.A.', swiftCode: 'COLOCOBM', code: 'BANCOLOMBIA' },
      { name: 'Banco de Bogotá', swiftCode: 'BOGOCOBM', code: 'BOGOTA' },
      { name: 'Davivienda', swiftCode: 'DABOCOBM', code: 'DAVIVIENDA' },
      { name: 'BBVA Colombia', swiftCode: 'BBVACOBM', code: 'BBVA_CO' }
    ]
  },
  {
    countryCode: 'CL',
    countryName: 'Chile',
    currency: 'CLP',
    currencySymbol: 'CL$',
    exchangeRateToUSD: 940.00,
    banks: [
      { name: 'Banco Santander-Chile', swiftCode: 'BSCHCLRM', code: 'SAN_CL' },
      { name: 'Banco de Chile', swiftCode: 'BCHICLRM', code: 'BCHILE' },
      { name: 'Banco Estado', swiftCode: 'BECHCLRM', code: 'BESTADO' },
      { name: 'BCI (Banco de Crédito e Inversiones)', swiftCode: 'BCIICLRM', code: 'BCI' }
    ]
  },
  {
    countryCode: 'PE',
    countryName: 'Peru',
    currency: 'PEN',
    currencySymbol: 'S/',
    exchangeRateToUSD: 3.76,
    banks: [
      { name: 'Banco de Crédito del Perú (BCP)', swiftCode: 'BCPLPEPL', code: 'BCP_PE' },
      { name: 'BBVA Perú', swiftCode: 'BCCOPEPL', code: 'BBVA_PE' },
      { name: 'Scotiabank Perú', swiftCode: 'BSPEPEPL', code: 'SCOTIA_PE' },
      { name: 'Interbank', swiftCode: 'BINIPEPL', code: 'INTERBANK' }
    ]
  },

  // AFRICA
  {
    countryCode: 'ZA',
    countryName: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    exchangeRateToUSD: 18.25,
    banks: [
      { name: 'Standard Bank of South Africa Ltd', swiftCode: 'SBZAJJ', code: 'SBSA' },
      { name: 'FirstRand Bank (FNB)', swiftCode: 'FIRNZAJJ', code: 'FNB' },
      { name: 'Absa Bank Limited', swiftCode: 'ABSAZAJJ', code: 'ABSA' },
      { name: 'Nedbank Limited', swiftCode: 'NEDBZAJJ', code: 'NED' },
      { name: 'Capitec Bank', swiftCode: 'CAPIZAJJ', code: 'CAP' },
      { name: 'Investec Bank', swiftCode: 'INVEZAJJ', code: 'INVESTEC' }
    ]
  },
  {
    countryCode: 'NG',
    countryName: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    exchangeRateToUSD: 1650.00,
    banks: [
      { name: 'Zenith Bank Plc', swiftCode: 'ZEIBNGLA', code: 'ZENITH' },
      { name: 'Access Bank Plc', swiftCode: 'ACCEENGLA', code: 'ACCESS' },
      { name: 'Guaranty Trust Bank (GTBank)', swiftCode: 'GTBINGLA', code: 'GTBANK' },
      { name: 'United Bank for Africa (UBA)', swiftCode: 'UNBANGLA', code: 'UBA' },
      { name: 'First Bank of Nigeria', swiftCode: 'FBNINGLA', code: 'FIRSTBANK' }
    ]
  },
  {
    countryCode: 'KE',
    countryName: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    exchangeRateToUSD: 129.50,
    banks: [
      { name: 'KCB Bank Kenya', swiftCode: 'KCBLKENX', code: 'KCB' },
      { name: 'Equity Bank Kenya', swiftCode: 'EQBLKENA', code: 'EQUITY' },
      { name: 'Co-operative Bank of Kenya', swiftCode: 'KCOOKENA', code: 'COOP' },
      { name: 'Standard Chartered Bank Kenya', swiftCode: 'SCBLKENX', code: 'SCB_KE' },
      { name: 'NCBA Bank Kenya', swiftCode: 'CBAFKENX', code: 'NCBA' }
    ]
  },
  {
    countryCode: 'EG',
    countryName: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'E£',
    exchangeRateToUSD: 48.50,
    banks: [
      { name: 'National Bank of Egypt (NBE)', swiftCode: 'NBEGEGCX', code: 'NBE' },
      { name: 'Banque Misr', swiftCode: 'BMISEGCX', code: 'MISR' },
      { name: 'Commercial International Bank (CIB)', swiftCode: 'CIBEEGCX', code: 'CIB_EG' },
      { name: 'QNB ALAHLI', swiftCode: 'NSGBEGCX', code: 'QNB_EG' }
    ]
  },
  {
    countryCode: 'MA',
    countryName: 'Morocco',
    currency: 'MAD',
    currencySymbol: 'DH',
    exchangeRateToUSD: 9.85,
    banks: [
      { name: 'Attijariwafa Bank', swiftCode: 'BCMAMAMC', code: 'AWB' },
      { name: 'Banque Populaire (BCP)', swiftCode: 'BPOPMAMC', code: 'BCP_MA' },
      { name: 'Bank of Africa (BMCE Group)', swiftCode: 'BMCEMAMC', code: 'BMCE' },
      { name: 'Société Générale Maroc', swiftCode: 'SGMBMAMC', code: 'SG_MA' }
    ]
  },
  {
    countryCode: 'GH',
    countryName: 'Ghana',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    exchangeRateToUSD: 15.60,
    banks: [
      { name: 'GCB Bank Limited', swiftCode: 'GHCBGHAC', code: 'GCB' },
      { name: 'Ecobank Ghana', swiftCode: 'ECOCGHAC', code: 'ECO_GH' },
      { name: 'Stanbic Bank Ghana', swiftCode: 'SBICGHAC', code: 'STANBIC_GH' },
      { name: 'Absa Bank Ghana', swiftCode: 'BARCGHAC', code: 'ABSA_GH' }
    ]
  }
];
