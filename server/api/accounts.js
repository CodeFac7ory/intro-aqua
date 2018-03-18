'use strict';
const Async = require('async');
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Account = server.plugins['hapi-mongo-models'].Account;
    const User = server.plugins['hapi-mongo-models'].User;
    const Status = server.plugins['hapi-mongo-models'].Status;


    server.route({
        method: 'GET',
        path: '/accounts',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.username) {
                query['user.name'] = new RegExp('^.*?' + EscapeRegExp(request.query.username) + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            Account.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/accounts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Account.findById(request.params.id, (err, account) => {

                if (err) {
                    return reply(err);
                }

                if (!account) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(account);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/accounts/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            const id = request.auth.credentials.roles.account._id.toString();
            const fields = Account.fieldsAdapter('user name title organization phone website timeCreated');

            Account.findById(id, fields, (err, account) => {

                if (err) {
                    return reply(err);
                }

                if (!account) {
                    return reply(Boom.notFound('Document not found. That is strange.'));
                }

                reply(account);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/accounts',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const name = request.payload.name;

            Account.create(name, (err, account) => {

                if (err) {
                    return reply(err);
                }

                reply(account);
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/accounts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.object().keys({
                        first: Joi.string().required(),
                        middle: Joi.string().allow(''),
                        last: Joi.string().required()
                    }).required()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    name: request.payload.name
                }
            };

            Account.findByIdAndUpdate(id, update, (err, account) => {

                if (err) {
                    return reply(err);
                }

                if (!account) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(account);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/accounts/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    name: Joi.object().keys({
                        first: Joi.string().required(),
                        middle: Joi.string().allow(''),
                        last: Joi.string().required()
                    }).required(),
                    organization: Joi.string().allow(''),
                    title: Joi.string().allow(''),
                    phone: Joi.string().allow(''),
                    website: Joi.string().allow(''),
                }
            }
        },
        handler: function (request, reply) {

            const id = request.auth.credentials.roles.account._id.toString();
            const update = {
                $set: {
                    name: request.payload.name,
                    title: request.payload.title,
                    organization: request.payload.organization,
                    phone: request.payload.phone,
                    website: request.payload.website,
                }
            };
            const findOptions = {
                fields: Account.fieldsAdapter('user name timeCreated')
            };

            Account.findByIdAndUpdate(id, update, findOptions, (err, account) => {

                if (err) {
                    return reply(err);
                }

                reply(account);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/accounts/my/profile-picture',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    output: 'stream',
                    allow: 'multipart/form-data',
                    profilePicture: Joi.any()
                }
            }
        },
        handler: function (request, reply) {
            console.log('----------profile-picture');
            console.log(request.payload.profilePicture);

            const data = request.payload;
            // console.log(request.payload);

            var mongo = require('mongodb');
            var Grid = require('gridfs-stream');
            var MongoClient = require('mongodb').MongoClient;
            var db = MongoClient.connect('mongodb://shareintro:Shareintro007@ds227325.mlab.com:27325/share-intro');
            var fs = require('fs');

            fs.readFile(request.payload.profilePicture.hapi.filename, function (e, bytes) {

                var buffer = new Buffer(bytes);
                let newId = DB.newID();

                db.gridFS.put(buffer, {_id: newId}, function (e, file_data) {
                    console.log('-----e');
                    console.log(e);

                    console.log('--------file_data');
                    console.log(file_data);


                    const id = request.auth.credentials.roles.account._id.toString();
                    const update = {
                        $set: {
                            profilePictureId: newId
                        }
                    };
                    const findOptions = {
                        fields: Account.fieldsAdapter('user name timeCreated')
                    };

                    Account.findByIdAndUpdate(id, update, findOptions, (err, account) => {

                        if (err) {
                            return reply(err);
                        }

                        reply(account);
                    });

                });
            });

            // var db = new mongo.Db('share-intro', new mongo.Server("mongodb://shareintro:Shareintro007@ds227325.mlab.com", 27325));
            // var db = new mongo.Db('mongodb://shareintro:Shareintro007@ds227325.mlab.com:27325/share-intro');
            // var gfs = Grid(db, mongo);

            // var writestream = gfs.createWriteStream({
            //     filename: 'my_file.txt'
            // });
            // fs.createReadStream(request.payload.profilePicture.hapi.filename).pipe(writestream);

            // image.on('finish', function () {
            //   reply({status: 'ok!'});
            // });

            // const id = request.auth.credentials.roles.account._id.toString();
            // const update = {
            //     $set: {
            //         profilePictureId: newId
            //     }
            // };
            // const findOptions = {
            //     fields: Account.fieldsAdapter('user name timeCreated')
            // };

            // Account.findByIdAndUpdate(id, update, findOptions, (err, account) => {

            //     if (err) {
            //         return reply(err);
            //     }

            //     reply(account);
            // });
        }
    });

    server.route({
        method: 'PUT',
        path: '/accounts/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    username: Joi.string().lowercase().required()
                }
            },
            pre: [{
                assign: 'account',
                method: function (request, reply) {

                    Account.findById(request.params.id, (err, account) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!account) {
                            return reply(Boom.notFound('Document not found.'));
                        }

                        reply(account);
                    });
                }
            }, {
                assign: 'user',
                method: function (request, reply) {

                    User.findByUsername(request.payload.username, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply(Boom.notFound('User document not found.'));
                        }

                        if (user.roles &&
                            user.roles.account &&
                            user.roles.account.id !== request.params.id) {

                            return reply(Boom.conflict('User is already linked to another account. Unlink first.'));
                        }

                        reply(user);
                    });
                }
            }, {
                assign: 'userCheck',
                method: function (request, reply) {

                    if (request.pre.account.user &&
                        request.pre.account.user.id !== request.pre.user._id.toString()) {

                        return reply(Boom.conflict('Account is already linked to another user. Unlink first.'));
                    }

                    reply(true);
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                account: function (done) {

                    const id = request.params.id;
                    const update = {
                        $set: {
                            user: {
                                id: request.pre.user._id.toString(),
                                name: request.pre.user.username
                            }
                        }
                    };

                    Account.findByIdAndUpdate(id, update, done);
                },
                user: function (done) {

                    const id = request.pre.user._id;
                    const update = {
                        $set: {
                            'roles.account': {
                                id: request.pre.account._id.toString(),
                                name: request.pre.account.name.first + ' ' + request.pre.account.name.last
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.account);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/accounts/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [{
                assign: 'account',
                method: function (request, reply) {

                    Account.findById(request.params.id, (err, account) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!account) {
                            return reply(Boom.notFound('Document not found.'));
                        }

                        if (!account.user || !account.user.id) {
                            return reply(account).takeover();
                        }

                        reply(account);
                    });
                }
            }, {
                assign: 'user',
                method: function (request, reply) {

                    User.findById(request.pre.account.user.id, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply(Boom.notFound('User document not found.'));
                        }

                        reply(user);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                account: function (done) {

                    const id = request.params.id;
                    const update = {
                        $unset: {
                            user: undefined
                        }
                    };

                    Account.findByIdAndUpdate(id, update, done);
                },
                user: function (done) {

                    const id = request.pre.user._id.toString();
                    const update = {
                        $unset: {
                            'roles.account': undefined
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.account);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/accounts/{id}/notes',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    data: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $push: {
                    notes: {
                        data: request.payload.data,
                        timeCreated: new Date(),
                        userCreated: {
                            id: request.auth.credentials.user._id.toString(),
                            name: request.auth.credentials.user.username
                        }
                    }
                }
            };

            Account.findByIdAndUpdate(id, update, (err, account) => {

                if (err) {
                    return reply(err);
                }

                reply(account);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/accounts/{id}/status',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    status: Joi.string().required()
                }
            },
            pre: [{
                assign: 'status',
                method: function (request, reply) {

                    Status.findById(request.payload.status, (err, status) => {

                        if (err) {
                            return reply(err);
                        }

                        reply(status);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const newStatus = {
                id: request.pre.status._id.toString(),
                name: request.pre.status.name,
                timeCreated: new Date(),
                userCreated: {
                    id: request.auth.credentials.user._id.toString(),
                    name: request.auth.credentials.user.username
                }
            };
            const update = {
                $set: {
                    'status.current': newStatus
                },
                $push: {
                    'status.log': newStatus
                }
            };

            Account.findByIdAndUpdate(id, update, (err, account) => {

                if (err) {
                    return reply(err);
                }

                reply(account);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/accounts/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            Account.findByIdAndDelete(request.params.id, (err, account) => {

                if (err) {
                    return reply(err);
                }

                if (!account) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply({ success: true });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'account'
};
