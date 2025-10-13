-- Update traits for the first four cats
UPDATE cats SET traits = ARRAY['Умная', 'Грациозная', 'Спокойная', 'Пафосная']
WHERE id = '8dc59575-1cdc-4c91-b70b-ec99342c00d1';

UPDATE cats SET traits = ARRAY['Эффектная', 'Бдительная', 'Игривая', 'Гордая']
WHERE id = 'bbe65989-6321-4f29-90fb-e949b7fea212';

UPDATE cats SET traits = ARRAY['Престижный', 'Преданный', 'Уверенный', 'Динамичный']
WHERE id = '767e2da6-a802-4fce-824c-fdd17231df79';

UPDATE cats SET traits = ARRAY['Блестящая', 'Наблюдательная', 'Умная', 'Непокорная']
WHERE id = '49448daa-a2f0-4959-b917-4dd09697d82e';