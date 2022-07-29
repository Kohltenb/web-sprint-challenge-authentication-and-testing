/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
 await knex('users').truncate()
 await knex('users').insert([
  {
    username: 'obi wan',
    password: '$2a$08$gdE7udGERouKN2lOQNW/t.oVPWxtova/.jXfh/63VKzEMJNLR.aga', //1234

  },
  {
    username: 'kenobi',
    password: '$2a$08$gdE7udGERouKN2lOQNW/t.oVPWxtova/.jXfh/63VKzEMJNLR.aga', //1234
  }
 ])
};
